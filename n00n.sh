#!/bin/bash

# --- Configuration Variables (Modify if needed) ---
N8N_USER="n8nuser"
N8N_PORT="6789"
N8N_CONFIG_DIR="/home/$N8N_USER/.n8n"
N8N_SERVICE_FILE="/etc/systemd/system/n8n.service"
PG_DATABASE="n8n"
PG_USER="n8nuser"

# --- Function to display messages ---
log_info() {
    echo -e "\n\e[1;34m[INFO]\e[0m $1"
}

log_success() {
    echo -e "\n\e[1;32m[SUCCESS]\e[0m $1"
}

log_error() {
    echo -e "\n\e[1;31m[ERROR]\e[0m $1"
    exit 1
}

# --- Check for sudo privileges ---
if [[ "$EUID" -ne 0 ]]; then
    log_error "Please run this script with sudo."
fi

log_info "Starting n8n production installation script..."

# --- Step 1: Update System Packages ---
log_info "1. Updating system packages..."
sudo apt update && sudo apt upgrade -y || log_error "Failed to update system packages."
log_success "System packages updated."

# --- Step 2: Add a System User for n8n ---
log_info "2. Creating system user '$N8N_USER'..."
if id "$N8N_USER" &>/dev/null; then
    log_info "User '$N8N_USER' already exists. Skipping user creation."
else
    sudo adduser --disabled-password --gecos "" "$N8N_USER" || log_error "Failed to create user '$N8N_USER'."
    sudo usermod -aG sudo "$N8N_USER" # Grant sudo temporarily for initial setup if needed, will remove later
    log_success "User '$N8N_USER' created."
fi


# --- Step 3: Install Node.js and npm ---
log_info "3. Installing Node.js (LTS 20.x) and npm..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - || log_error "Failed to add NodeSource PPA."
    sudo apt-get install -y nodejs || log_error "Failed to install Node.js."
    log_success "Node.js and npm installed."
else
    log_info "Node.js already installed. Skipping."
fi

# --- Step 4: Install n8n Globally ---
log_info "4. Installing n8n globally..."
sudo npm install -g n8n || log_error "Failed to install n8n globally."
log_success "n8n installed globally."

# --- Step 5: Install PostgreSQL ---
log_info "5. Installing PostgreSQL..."
sudo apt install postgresql postgresql-contrib -y || log_error "Failed to install PostgreSQL."
log_success "PostgreSQL installed."

# --- Step 6: Configure PostgreSQL for n8n ---
log_info "6. Configuring PostgreSQL for n8n..."

read -s -p "Enter a STRONG password for the PostgreSQL user '$PG_USER': " PG_PASSWORD
echo

sudo -i -u postgres psql -c "CREATE DATABASE $PG_DATABASE;" || log_error "Failed to create PostgreSQL database '$PG_DATABASE'."
sudo -i -u postgres psql -c "CREATE USER $PG_USER WITH PASSWORD '$PG_PASSWORD';" || log_error "Failed to create PostgreSQL user '$PG_USER'."
sudo -i -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $PG_DATABASE TO $PG_USER;" || log_error "Failed to grant privileges on '$PG_DATABASE' to '$PG_USER'."
log_success "PostgreSQL configured for n8n."

# --- Step 7: Create n8n Environment File ---
log_info "7. Creating n8n environment file (.env)..."

read -p "Enter your n8n domain (e.g., n8n.yourdomain.com): " N8N_DOMAIN

sudo -u "$N8N_USER" mkdir -p "$N8N_CONFIG_DIR" || log_error "Failed to create n8n config directory."
sudo -u "$N8N_USER" tee "$N8N_CONFIG_DIR/.env" > /dev/null <<EOF
WEBHOOK_URL=https://$N8N_DOMAIN/
WEBHOOK_TUNNEL_URL=https://$N8N_DOMAIN/
N8N_HOST=0.0.0.0
N8N_PORT=$N8N_PORT
N8N_PROTOCOL=https
NODE_ENV=production

DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_DATABASE=$PG_DATABASE
DB_POSTGRESDB_USER=$PG_USER
DB_POSTGRESDB_PASSWORD=$PG_PASSWORD
EOF

log_success "n8n environment file created at $N8N_CONFIG_DIR/.env"

# --- Step 8: Create a Systemd Service for n8n ---
log_info "8. Creating Systemd service for n8n..."

sudo tee "$N8N_SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=n8n workflow automation
After=network.target postgresql.service # Ensure PostgreSQL is up before n8n

[Service]
Type=simple
User=$N8N_USER
WorkingDirectory=$N8N_CONFIG_DIR
EnvironmentFile=$N8N_CONFIG_DIR/.env
ExecStart=/usr/bin/n8n start
Restart=on-failure
RestartSec=10
TimeoutStartSec=60
TimeoutStopSec=60

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload || log_error "Failed to reload systemd daemon."
sudo systemctl enable n8n || log_error "Failed to enable n8n service."
sudo systemctl start n8n || log_error "Failed to start n8n service."
log_success "n8n Systemd service created and started. Check status with 'sudo systemctl status n8n'."

# --- Step 9: Install and Configure Nginx (Reverse Proxy) ---
log_info "9. Installing and configuring Nginx..."
sudo apt install nginx -y || log_error "Failed to install Nginx."

sudo tee "/etc/nginx/sites-available/$N8N_DOMAIN" > /dev/null <<EOF
server {
    listen 80;
    server_name $N8N_DOMAIN;

    location / {
        proxy_pass http://localhost:$N8N_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

sudo ln -s "/etc/nginx/sites-available/$N8N_DOMAIN" "/etc/nginx/sites-enabled/" || log_error "Failed to create Nginx symlink."
sudo nginx -t || log_error "Nginx configuration test failed. Check '/etc/nginx/sites-available/$N8N_DOMAIN'."
sudo systemctl restart nginx || log_error "Failed to restart Nginx."
log_success "Nginx installed and configured."

# --- Step 10: Install SSL Certificate with Certbot ---
log_info "10. Installing SSL Certificate with Certbot (Let's Encrypt)..."
sudo apt install certbot python3-certbot-nginx -y || log_error "Failed to install Certbot."

log_info "Running Certbot. Follow the prompts to obtain your SSL certificate."
sudo certbot --nginx -d "$N8N_DOMAIN" || log_error "Certbot failed to obtain SSL certificate."
log_success "SSL certificate obtained and Nginx configured for HTTPS."

# --- Step 11: Configure UFW Firewall ---
log_info "11. Configuring UFW Firewall (if enabled)..."
if sudo ufw status | grep -q "inactive"; then
    log_info "UFW is inactive. You might want to enable it manually after this script."
else
    sudo ufw allow 'Nginx Full' || log_error "Failed to allow Nginx Full in UFW."
    log_success "UFW configured to allow Nginx Full."
fi


log_info "--- Installation Complete! ---"
echo "You should now be able to access n8n at: https://$N8N_DOMAIN"
echo "On your first visit, you'll be prompted to create an admin user."
echo "Remember to secure your server and back up your data regularly!"

# Revoke sudo privileges for n8nuser (if initially granted for setup)
if grep -q "$N8N_USER ALL=(ALL) NOPASSWD:ALL" /etc/sudoers; then
    log_info "Removing temporary sudo privileges for $N8N_USER from /etc/sudoers..."
    sudo sed -i "/^$N8N_USER ALL=(ALL) NOPASSWD:ALL/d" /etc/sudoers
    log_success "Temporary sudo privileges removed for $N8N_USER."
fi

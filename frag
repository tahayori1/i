[{"log":{"access":"","error":"","loglevel":"none","dnsLog":false},"remarks":"Iranian CypherPunks Fragment","dns":{"tag":"dns","hosts":{"cloudflare.com":["104.16.123.96","104.16.133.229"],"cloudflare-dns.com":["172.67.73.38","104.19.155.92","172.67.73.163","104.18.155.42","104.16.124.175","104.16.248.249","104.16.249.249","162.159.129.53","104.26.13.8"],"domain:youtube.com":["google.com"]},"servers":["https://cloudflare-dns.com/dns-query"]},"inbounds":[{"domainOverride":["http","tls"],"protocol":"socks","tag":"socks-in","listen":"127.0.0.1","port":10808,"settings":{"auth":"noauth","udp":true,"userLevel":8},"sniffing":{"enabled":true,"destOverride":["http","tls"]}},{"protocol":"http","tag":"http-in","listen":"127.0.0.1","port":10809,"settings":{"userLevel":8},"sniffing":{"enabled":true,"destOverride":["http","tls"]}}],"outbounds":[{"protocol":"freedom","tag":"fragment-out","domainStrategy":"UseIP","sniffing":{"enabled":true,"destOverride":["http","tls"]},"settings":{"fragment":{"packets":"tlshello","length":"10-20","interval":"10-20"}},"streamSettings":{"sockopt":{"tcpNoDelay":true,"tcpKeepAliveIdle":100,"mark":255,"domainStrategy":"UseIP"}}},{"protocol":"dns","tag":"dns-out"},{"protocol":"vless","tag":"fakeproxy-out","domainStrategy":"","settings":{"vnext":[{"address":"cloudflare.com","port":443,"users":[{"encryption":"none","flow":"","id":"UUID","level":8,"security":"auto"}]}]},"streamSettings":{"network":"ws","security":"tls","tlsSettings":{"allowInsecure":false,"alpn":["h2","http/1.1"],"fingerprint":"randomized","publicKey":"","serverName":"cloudflare.com","shortId":"","show":false,"spiderX":""},"wsSettings":{"headers":{"Host":"cloudflare.com"},"path":"/"}},"mux":{"concurrency":8,"enabled":false}}],"policy":{"levels":{"8":{"connIdle":300,"downlinkOnly":1,"handshake":4,"uplinkOnly":1}},"system":{"statsOutboundUplink":true,"statsOutboundDownlink":true}},"routing":{"domainStrategy":"IPIfNonMatch","rules":[{"inboundTag":["socks-in","http-in"],"type":"field","port":"53","outboundTag":"dns-out","enabled":true},{"inboundTag":["socks-in","http-in"],"type":"field","port":"0-65535","outboundTag":"fragment-out","enabled":true}],"strategy":"rules"},"stats":{}},
{
  "log": {
    "access": "",
    "error": "",
    "loglevel": "none",
    "dnsLog": false
  },
  "dns": {
    "tag": "dns",
    "hosts": {
      "cloudflare-dns.com": [
        "172.67.73.38",
        "104.19.155.92",
        "172.67.73.163",
        "104.18.155.42",
        "104.16.124.175",
        "104.16.248.249",
        "104.16.249.249",
        "104.26.13.8"        
      ],
      "domain:youtube.com": [
        "google.com"
      ]
    },
    "servers": [
      "https://cloudflare-dns.com/dns-query"
    ]
  },
  "inbounds": [
    {
      "domainOverride": [
        "http",
        "tls"
      ],
      "protocol": "socks",
      "tag": "socks-in",
      "listen": "127.0.0.1",
      "port": 10808,
      "settings": {
        "auth": "noauth",
        "udp": true,
        "userLevel": 8
      },
      "sniffing": {
        "enabled": true,
        "destOverride": [
          "http",
          "tls"
        ]
      }
    },
    {
      "protocol": "http",
      "tag": "http-in",
      "listen": "127.0.0.1",
      "port": 10809,
      "settings": {
        "userLevel": 8
      },
      "sniffing": {
        "enabled": true,
        "destOverride": [
          "http",
          "tls"
        ]
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "tag": "fragment-out",
      "domainStrategy": "UseIP",
      "sniffing": {
        "enabled": true,
        "destOverride": [
          "http",
          "tls"
        ]
      },
      "settings": {
        "fragment": {
          "packets": "tlshello",
          "length": "10-20",
          "interval": "10-20"
        }
      },
      "streamSettings": {
        "sockopt": {
          "tcpNoDelay": true,
          "tcpKeepAliveIdle": 100,
          "mark": 255,
          "domainStrategy": "UseIP"
        }
      }
    },
    {
      "protocol": "dns",
      "tag": "dns-out"
    },
    {
      "protocol": "vless",
      "tag": "fakeproxy-out",
      "domainStrategy": "",
      "settings": {
        "vnext": [
          {
            "address": "google.com",
            "port": 443,
            "users": [
              {
                "encryption": "none",
                "flow": "",
                "id": "UUID",
                "level": 8,
                "security": "auto"
              }
            ]
          }
        ]
      },
      "streamSettings": {
        "network": "ws",
        "security": "tls",
        "tlsSettings": {
          "allowInsecure": false,
          "alpn": [
            "h2",
            "http/1.1"
          ],
          "fingerprint": "randomized",
          "publicKey": "",
          "serverName": "google.com",
          "shortId": "",
          "show": false,
          "spiderX": ""
        },
        "wsSettings": {
          "headers": {
            "Host": "google.com"
          },
          "path": "/"
        }
      },
      "mux": {
        "concurrency": 8,
        "enabled": false
      }
    }
  ],
  "policy": {
    "levels": {
      "8": {
        "connIdle": 300,
        "downlinkOnly": 1,
        "handshake": 4,
        "uplinkOnly": 1
      }
    },
    "system": {
      "statsOutboundUplink": true,
      "statsOutboundDownlink": true
    }
  },
  "routing": {
    "domainStrategy": "IPIfNonMatch",
    "rules": [
      {
        "inboundTag": [
          "socks-in",
          "http-in"
        ],
        "type": "field",
        "port": "53",
        "outboundTag": "dns-out",
        "enabled": true
      },
      {
        "inboundTag": [
          "socks-in",
          "http-in"
        ],
        "type": "field",
        "port": "0-65535",
        "outboundTag": "fragment-out",
        "enabled": true
      }
    ],
    "strategy": "rules"
  },
  "stats": {}
},
 {
    "dns": {
      "hosts": {
        "cloudflare-dns.com": [
                    "104.16.248.249",
                    "104.16.249.249",
                    "104.16.133.229",
                    "104.16.132.229",
                    "104.17.147.22",
                    "104.17.148.22",
                    "172.64.33.103",
                    "108.162.193.103",
                    "173.245.59.103",
                    "172.64.32.128",
                    "108.162.192.128",
                    "173.245.58.128"
        ],
        "geosite:category-ads-all": "127.0.0.1",
        "geosite:category-ads-ir": "127.0.0.1",
        "geosite:category-porn": "127.0.0.1"
      },
      "servers": [
                "https:\/\/cloudflare-dns.com\/dns-query"
      ],
      "tag": "dns"
    },
    "inbounds": [
      {
        "port": 10808,
        "protocol": "socks",
        "settings": {
          "auth": "noauth",
          "udp": true,
          "userLevel": 8
        },
        "sniffing": {
          "destOverride": [
                        "http",
                        "tls"
          ],
          "enabled": true
        },
        "tag": "socks-in"
      },
      {
        "port": 10809,
        "protocol": "http",
        "settings": {
          "auth": "noauth",
          "udp": true,
          "userLevel": 8
        },
        "sniffing": {
          "destOverride": [
                        "http",
                        "tls"
          ],
          "enabled": true
        },
        "tag": "http-in"
      }
    ],
    "log": {
      "loglevel": "warning"
    },
    "outbounds": [
      {
        "protocol": "freedom",
        "settings": {
          "domainStrategy": "UseIP",
          "fragment": {
            "interval": "10-20",
            "length": "10-20",
            "packets": "tlshello"
          }
        },
        "streamSettings": {
          "sockopt": {
            "tcpKeepAliveIdle": 100,
            "tcpNoDelay": true
          }
        },
        "tag": "fragment"
      },
      {
        "protocol": "dns",
        "tag": "dns-out"
      },
      {
        "protocol": "vless",
        "settings": {
          "vnext": [
            {
              "address": "google.com",
              "port": 443,
              "users": [
                {
                  "encryption": "none",
                  "flow": "",
                  "id": "79fec513-71a0-4460-a5f6-92a23e4b4c83",
                  "level": 8,
                  "security": "auto"
                }
              ]
            }
          ]
        },
        "streamSettings": {
          "network": "ws",
          "security": "tls",
          "tlsSettings": {
            "allowInsecure": false,
            "alpn": [
                            "h2",
                            "http\/1.1"
            ],
            "fingerprint": "chrome",
            "serverName": "google.com"
          },
          "wsSettings": {
            "headers": {
              "Host": "google.com"
            },
            "path": "/"
          }
        },
        "tag": "fake-outbound"
      },
      {
        "protocol": "freedom",
        "settings": {
        },
        "tag": "direct"
      },
      {
        "protocol": "blackhole",
        "settings": {
          "response": {
            "type": "http"
          }
        },
        "tag": "block"
      }
    ],
    "policy": {
      "levels": {
        "8": {
          "connIdle": 300,
          "downlinkOnly": 1,
          "handshake": 4,
          "uplinkOnly": 1
        }
      },
      "system": {
        "statsOutboundDownlink": true,
        "statsOutboundUplink": true
      }
    },
    "remarks": "⚡️ Frag - WorkerLess ( Youtube, X , ... )",
    "routing": {
      "domainStrategy": "IPIfNonMatch",
      "rules": [
        {
          "enabled": true,
          "inboundTag": [
                        "socks-in",
                        "http-in"
          ],
          "outboundTag": "dns-out",
          "port": "53",
          "type": "field"
        },
        {
          "ip": [
                        "geoip:private"
          ],
          "outboundTag": "direct",
          "type": "field"
        },
        {
          "domain": [
                        "geosite:category-ads-all",
                        "geosite:category-ads-ir",
                        "geosite:category-porn"
          ],
          "outboundTag": "block",
          "type": "field"
        },
        {
          "network": "tcp,udp",
          "outboundTag": "fragment",
          "type": "field"
        }
      ]
    },
    "stats": {
    }
  }]

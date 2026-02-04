## GitHub Copilot Chat

- Extension Version: 0.27.0 (prod)
- VS Code: vscode/1.100.0
- OS: Windows

## Network

User Settings:
```json
  "github.copilot.advanced.debug.useElectronFetcher": true,
  "github.copilot.advanced.debug.useNodeFetcher": false,
  "github.copilot.advanced.debug.useNodeFetchFetcher": true
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 140.82.121.5 (15 ms)
- DNS ipv6 Lookup: Error (32 ms): getaddrinfo ENOTFOUND api.github.com
- Proxy URL: None (2 ms)
- Electron fetch (configured): HTTP 200 (502 ms)
- Node.js https: HTTP 200 (516 ms)
- Node.js fetch: HTTP 200 (754 ms)
- Helix fetch: HTTP 200 (678 ms)

Connecting to https://api.individual.githubcopilot.com/_ping:
- DNS ipv4 Lookup: 140.82.112.22 (98 ms)
- DNS ipv6 Lookup: Error (128 ms): getaddrinfo ENOTFOUND api.individual.githubcopilot.com
- Proxy URL: None (6 ms)
- Electron fetch (configured): HTTP 200 (798 ms)
- Node.js https: HTTP 200 (747 ms)
- Node.js fetch: HTTP 200 (699 ms)
- Helix fetch: HTTP 200 (686 ms)

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).
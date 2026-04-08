# Selected Log Excerpts

## Successful Startup

```text
▲ Next.js 15.4.11
- Local:        http://127.0.0.1:3000
- Network:      http://127.0.0.1:3000
- Environments: .env

✓ Starting...
✓ Ready in 19.9s
```

## Successful Route Compilation / Requests

```text
○ Compiling / ...
✓ Compiled / in 21.2s (833 modules)
GET / 200 in 7192ms

○ Compiling /books ...
✓ Compiled /books in 2.7s (826 modules)
GET /books 200 in 3056ms

○ Compiling /authors ...
✓ Compiled /authors in 1460ms (898 modules)
GET /authors 200 in 1742ms

○ Compiling /authors/[slug] ...
✓ Compiled /authors/[slug] in 1113ms (932 modules)
GET /authors/nguyen-nhat-anh 200 in 3796ms
GET /authors/nam-cao 200 in 34ms
```

## Warning Observed

```text
[10:52:33] WARN: No email adapter provided. Email will be written to console.
```

## Initial Startup Command Failure

```text
> da-webnc@1.0.0 dev D:\Đồ án\DA-WEBNC
> cross-env NODE_OPTIONS=--no-deprecation next dev "--" "--hostname" "127.0.0.1" "--port" "3000"

ELIFECYCLE Command failed with exit code 1.

Invalid project directory provided, no such directory: D:\Đồ án\DA-WEBNC\--hostname
```

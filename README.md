To reproduce, run:

```bash
# install deps
yarn

# set secret
export STATSIG_SERVER_SDK="server-xxxx..."

# run until it syncs the id lists (doesn't happen every time)
while node backend.js; do :; done
```

The script will exit with a non-zero exit code once the id lists have been synced.

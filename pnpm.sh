rm -f ~/.npmrc
npm config set auth-type=legacy
npm install -g npm@10
corepack enable
cd ~/dev/riad-gym-pro
rm -rf node_modules package-lock.json
pnpm login
pnpm install
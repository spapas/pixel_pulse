# Pixel Pulse

Auto-runner pixel arcade game (HTML5, no dependencies).
BIT.TRIP-style: one-button jumps, ducking, coins, combo,
power-ups, procedural chiptune.

## Run

Open `index.html` in Chrome/Edge, or serve locally:

```
node -e "require('http').createServer((q,s)=>{require('fs').readFile('.'+q.url.split('?')[0],(e,d)=>{if(e){s.writeHead(404);s.end()}else{s.writeHead(200,{'Content-Type':'text/html'});s.end(d)}})}).listen(8901)"
```

Dev panel (sliders + tuning): `index.html?dev=1`.

## Controls

- Space / Up / click: jump (hold = higher)
- Down: duck - M: music - P: pause - R: restart

## Deploy

itch.io via butler: `butler push deploy spapas/pixel-runner:html`

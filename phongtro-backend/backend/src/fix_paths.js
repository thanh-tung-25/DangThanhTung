const fs = require('fs');
const path = require('path');

function walk(dir) {
    fs.readdirSync(dir).forEach(f => {
        let p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) walk(p);
        else if (p.endsWith('.html') || p.endsWith('.js')) {
            let c = fs.readFileSync(p, 'utf8');
            let modified = false;
            
            // Fix href="/frontend/...
            if (c.includes('href="/frontend/')) {
                c = c.replace(/href="\/frontend\//g, 'href="../../');
                modified = true;
            }
            
            // Fix window.location.href = '/frontend/...
            if (c.includes("'/frontend/")) {
                c = c.replace(/'\/frontend\//g, "'../../");
                modified = true;
            }
            if (c.includes('"/frontend/')) {
                c = c.replace(/"\/frontend\//g, '"../../');
                modified = true;
            }
            if (c.includes('`/frontend/')) {
                c = c.replace(/`\/frontend\//g, '`../../');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(p, c, 'utf8');
                console.log('Fixed', p);
            }
        }
    });
}

walk(path.join(__dirname, '../../frontend'));

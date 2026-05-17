const http = require('http');
const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/gotti/.gemini/antigravity/brain/731c71c5-7b07-481c-b548-e91b67321ed0';

const server = http.createServer((req, res) => {
    const filePath = path.join(dir, req.url);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        res.writeHead(200, { 'Content-Type': 'image/png' });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(8888, () => {
    console.log('Server running on port 8888');
});

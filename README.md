# proxy
This a simple proxy middleware which is implemented by express and javascript.

## Usage
If you want to use this repo, you need to clone this repository.
```
# ssh
git clone git@github.com:117sparta/proxy.git

# https
git clone https://github.com/117sparta/proxy.git
```
Then open the directory where you clone this project, open a command line and input:
```
npm install
```

After the last step is finished, enter `npm start`, then the server is activated.

Change the proxyConfig in proxyConfig.js to change the website that you want to visit. It is like this:
```
{
   host: '', // hostname without the port
   post: 443, // port of the website that you want to visit
   protocol: 'https' // only 'https:' and 'http:' is available
}
```

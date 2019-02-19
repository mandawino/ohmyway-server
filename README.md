# ohmyway

Ohmyway is a personal blog displaying some photos from my travel in Southeast Asia (and later South America).

The main reason I created this project is to acquire better skills in some technologies I'm interested in,
even if some are not necessary for this simple project.

This project uses :
- **ohmyway-client** (client side): React, Redux, Reactstrap (Bootstrap), CSS grid layout, Webpack, Babel...
- **ohmyway-server** (server side): Hapi (a server framework for Node.js)


This is only a first draft which I would like to improve in the near future.

Here are the next TODO steps I need to work on:
- Add tests on both sides of the application
- Use a database to store the images and other data (currently directly stored in the filesystem)
- Add more images and take care of the larger scale of data (pagination)
- Make a functional production version
- Host it on a real server


## How to make it work
Go to the place where you want to put the project and create a directory to receive the project :
```
mkdir ohmyway
cd ohmyway
```

Then, launch the server:
```
cd ohmyway-server
git clone https://github.com/mandawino/ohmyway-server.git
npm install
npm start
```

Finally, launch the client in a new terminal:
```
cd ohmyway-client
git clone https://github.com/mandawino/ohmyway-client.git
npm install
npm start
```

Now you can go to **localhost:3000** in you browser to access the client,
or **localhost:8080** if you want to directly access the server.

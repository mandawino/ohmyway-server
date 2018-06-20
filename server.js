'use strict'
const Hapi = require('hapi')
const Boom = require('boom')
const Path = require('path')
const Inert = require('inert')
const fs = require('fs');
const Good = require('good')


let goodOptions = {
	ops: {
		interval: 600000
	},
	reporters: {
		console: [
			{
				module: 'good-console',
				args: [{ log: ['error'], response: '*' }]
			}, 
			'stdout'
		],
		//file: [
		//	{
		//		module: 'good-file',
		//		args: [{ log: ['error']}]
		//	},
		//	'logs/logfile' // TODO Change with a file
		//]
	}
}

const walkSync = (dir, filelist = []) => {
	fs.readdirSync(dir).forEach(file => {
		if(!(/^\./.test(file))) {
	    	filelist = fs.statSync(Path.join(dir, file)).isDirectory()
	    		? walkSync(Path.join(dir, file), filelist)
	    		: filelist.concat(Path.join(dir, file));
    	}})
	// server.log(filelist)
	
	//result = {}
	//filelist.forEach((image, index) => {
	//	server.log(image)
	//	result.index = image
	//})
    return filelist;
}


const server = Hapi.Server({
		host: 'localhost',
		port: 8080,
		routes: { cors: true }
})

server.route({
	method: 'GET',
	path: '/',
	handler: (request, h) => {
		server.log('helloworld')
		return 'Hello world'
	}
})

server.route({
	method: 'GET',
	path: '/boom',
	handler: (request) => {
		return Boom.notFound()
	}
})

server.route({
	method: 'GET',
	path: '/images/{country?}',
	handler: (request, h) => {
		const country = encodeURIComponent(request.params.country)
		server.log(country)
		const response = country 
				? h.response(walkSync(Path.join(__dirname, 'images', country))) 
				: h.response(walkSync(Path.join(__dirname, 'images')))
		response.type('text/plain')
		return response
	}
})

server.route({
	method: 'GET',
	path:'/image',
	handler: (request, h) => {
		const path = request.query.path;
		// server.log(path)
		const response = h.file(path)
		return response.encoding('base64')
		//const image = fs.readFileSync(path);
		// server.log('image', image)
		//var buf = Buffer.from(image);
		//server.log('buf', buf)
		//var res = buf.toString('base64')
		//server.log('res', res)
		//reply(res)

		//reply(buf).bytes(buf.length).header('Content-type', 'image/jpg');
		// const path = encodeURIComponent(request.params.imagePath);
		// .header('Content-type','image/jpg');
		// .header('Content-Disposition','inline')
	}
})

server.route({
	method: 'GET',
	path: '/file/{filepath*3}',
	handler: (request) => {
		return request.params
		// `Hello ${request.params.name}
	}
})


const start = async () => {
	try {

		await server.register([{
			plugin: Good,
			options: goodOptions
		}, {
			plugin: Inert,
			options: {}
		}])

		await server.start()

		console.log(`Hapi server running at ${server.info.uri}`);

	} catch (err) {
		console.log("Hapi error starting server", err);
	}
}

start();


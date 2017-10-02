'use strict'
const Hapi = require('hapi')
const Boom = require('boom')
const Path = require('path')
const Inert = require('inert')
const fs = require('fs');
const Good = require('good')


const server = new Hapi.Server()
server.connection({
	host: 'localhost',
	port: 8080,
	routes: { cors: true }
})

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
	server.log(filelist)
	//result = {}
	//filelist.forEach((image, index) => {
	//	server.log(image)
	//	result.index = image
	//})
    return filelist;
}


server.register([{
    register: Good,
    options: goodOptions
}, {
    register: Inert,
    options: {}
}], (err) => {

	server.route({
		method: 'GET',
		path: '/{image*}',
		handler: {
			directory: {
				path: Path.join(__dirname, 'images')			
			}
		}
	})

	server.route({
		method: 'GET',
		path: '/images',
		handler: (request, reply) => {
			reply.response(walkSync(Path.join(__dirname, 'images'))).type('text/plain')
		}
	})

	server.route({
		method: 'GET',
		path:'/image',
		handler: function (request, reply) { // async
			const path = request.query.path;
			server.log(path)
			//const image = fs.readFileSync(path);
			// server.log('image', image)
			//var buf = Buffer.from(image);
			//server.log('buf', buf)
			//var res = buf.toString('base64')
			//server.log('res', res)
			//reply(res)

			//reply(buf).bytes(buf.length).header('Content-type', 'image/jpg');
			// const path = encodeURIComponent(request.params.imagePath);
			reply.file(path).encoding('base64')
			// .header('Content-type','image/jpg');
			// .header('Content-Disposition','inline')
		}
	})

	server.route({
		method: 'GET',
		path: '/ping',
		handler: (request, reply) => {
			server.log('error', 'An error')
			server.error('info', 'An info')
			reply()
		}
	})

	server.route({
		method: 'GET',
		path: '/file/{filepath*3}',
		handler: (request, reply) => {
			reply(request.params)
			// `Hello ${request.params.name}
		}
	})

	server.route({
		method: 'GET',
		path: '/boom',
		handler: (request, reply) => {
			reply(Boom.notFound())
		}
	})

	server.start(() => console.log(`Started at : ${server.info.uri}`))
})


var env = process.env.NODE_ENV || 'development';
console.log(`***** ${env} *****`)
if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/riverTest';
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/riverTest';
}
else {
  process.env.MONGODB_URI='mongodb://akt_rabbit:haha@ds251807.mlab.com:51807/akt_rabbit';
}

var plan = require("flightplan")
var glob=require("glob")


plan.target('staging', {
  host: '120.55.125.236',
  username: 'root',
  password:"vO5TKznhv0fyl4"
  // privateKey: '/Users/jarvan/.ssh/id_rsa',
  // agent: process.env.SSH_AUTH_SOCK
})

plan.target('test', {
  host: '139.196.54.2',
  username: 'root',
  password:"ABcd1234"
  // privateKey: '/Users/jarvan/.ssh/id_rsa',
  // agent: process.env.SSH_AUTH_SOCK
})

// plan.local(function(local){
//     local.exec('gulp')
// })

plan.local(function(local){
  local.exec("gulp compile_coffee")
  local.exec("gulp index")
  local.exec("gulp build-less")
  local.exec("git add ./")
  local.exec("git commit -m 'neversion'")
  local.exec("git push origin master")
});

plan.remote(function(remote){

    remote.exec("cd /alidata/server/tomcat-public/webapps/ROOT/ltx &&  git pull origin master")
    remote.exec("cp -r -f /alidata/server/tomcat-public/webapps/ROOT/ltx/* /alidata/server/tomcat-public/webapps/ROOT/")

})

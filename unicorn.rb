worker_processes 3
working_directory "/home/timofe_/crittr.me"

timeout 30

# This is where we specify the socket.
# We will point the upstream Nginx module to this socket later on
listen "/home/timofe_/crittr.me/tmp/sockets/unicorn.sock", :backlog => 1024 # 64 before

pid "/home/timofe_/crittr.me/tmp/pids/unicorn.pid"

# Set the path of the log files inside the log folder of the app
stderr_path "/home/timofe_/crittr.me/log/unicorn.stderr.log"
stdout_path "/home/timofe_/crittr.me/log/unicorn.stdout.log"

before_fork do |server, worker|
# This option works in together with preload_app true setting
# What is does is prevent the master process from holding
# the database connection
 # defined?(Sequel::Database) and
    #DB.disconnect
end
#
after_fork do |server, worker|
# Here we are establishing the connection after forking worker
# processes
 # defined?(Sequel::Database) and
    #Sequel::Database.connect('mysql2://fetimocom1:iBMbSSIz@mysql.fetimo.com/twittercritter')
end
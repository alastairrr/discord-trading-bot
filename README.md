# Discord Stock Trading Bot Using Alpaca API
Fun way to trade stocks live on discord servers.

# Server Hosting
Project uses a loophole between Replit and UptimeRobot that acts as a free server to host the bot 24/7.
By setting up a HTTP port in Replit, UptimeRobot periodically pings Replit HTTP link to keep Replit project alive, acting as a de facto server.

This server loophole is ideal for projects with small demands, but it has limitations; such as limited CPU and memory resources, and a rare periodic downtime (usually 5-50 minutes of downtime). Replit server usually reboots automatically after downtime.

# Alpaca API
Trading with real time quotes is achieved via [Alpaca API](https://alpaca.markets/). 
Free API version is limited to 200 calls/minute. Project implements a simple token bucket rate limiter to manage the API rate limit.



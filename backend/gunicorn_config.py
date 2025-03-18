# Gunicorn configuration for optimal performance on a low-resource server

# Bind to all network interfaces on port 5000
bind = "0.0.0.0:5000"

# Use fewer workers for a low-resource server
workers = 2

# Use threads for concurrent processing with lower memory footprint
threads = 2

# Timeout settings
timeout = 60

# Lower keepalive for better resource usage
keepalive = 5

# Worker class optimized for API workloads
worker_class = "sync"

# Reduce logging overhead in production
accesslog = "-"
errorlog = "-"
loglevel = "warning"

# Preload application for faster response times
preload_app = True

# Graceful timeout
graceful_timeout = 10

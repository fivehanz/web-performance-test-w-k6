include .env

main:
	make main-performance
	make main-stress
	make main-spike

main-performance:
	K6_PROMETHEUS_RW_SERVER_URL=${K6_PROMETHEUS_RW_SERVER_URL} \
		K6_PROMETHEUS_RW_TREND_STATS=${K6_PROMETHEUS_RW_TREND_STATS} \
		k6 run --tag testid=${TARGET}-${TESTID} -e TARGET=${TARGET} -o experimental-prometheus-rw performance.js

main-stress:
	K6_PROMETHEUS_RW_SERVER_URL=${K6_PROMETHEUS_RW_SERVER_URL} \
		K6_PROMETHEUS_RW_TREND_STATS=${K6_PROMETHEUS_RW_TREND_STATS} \
		k6 run --tag testid=${TARGET}-${TESTID} -e TARGET=${TARGET} -o experimental-prometheus-rw stress.js

main-spike:
	K6_PROMETHEUS_RW_SERVER_URL=${K6_PROMETHEUS_RW_SERVER_URL} \
		K6_PROMETHEUS_RW_TREND_STATS=${K6_PROMETHEUS_RW_TREND_STATS} \
		k6 run --tag testid=${TARGET}-${TESTID} -e TARGET=${TARGET} -o experimental-prometheus-rw spike.js

web-performance:
	K6_WEB_DASHBOARD=true k6 run -e TARGET=${TARGET} performance.js

web-stress:
	K6_WEB_DASHBOARD=true k6 run -e TARGET=${TARGET} stress.js

web-spike:
	K6_WEB_DASHBOARD=true k6 run -e TARGET=${TARGET} spike.js

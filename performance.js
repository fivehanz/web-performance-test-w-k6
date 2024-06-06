import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '30s', target: 100 },  // ramp up to 100 users
    { duration: '1m', target: 100 },   // stay at 100 users for 1 minute
    { duration: '30s', target: 200 },  // ramp up to 200 users over 30 seconds
    { duration: '1m', target: 200 },   // stay at 200 users for 1 minute
    { duration: '30s', target: 300 },  // ramp up to 300 users over 30 seconds
    { duration: '1m', target: 300 },   // stay at 300 users for 1 minute
    { duration: '30s', target: 400 },  // ramp up to 400 users over 30 seconds
    { duration: '1m', target: 400 },   // stay at 400 users for 1 minute
    { duration: '30s', target: 0 },    // ramp down to 0 users
  ],
  thresholds: {
    'errors': ['rate<0.1'], // <10% errors
    'http_req_duration': ['p(90)<2500'],
  },
  tlsVersion: {
    min: http.TLS_1_2,
    max: http.TLS_1_3,
  },
};

export default function () {
  let res = http.get(`https://${__ENV.TARGET}/`);
  
  const checkRes = check(res, {
    'protocol is HTTP/2': (r) => r.proto === 'HTTP/2.0',
    'status is 200': (r) => r.status === 200,
    'is OCSP response good': (r) => r.ocsp.status === http.OCSP_STATUS_GOOD,
  });

  errorRate.add(!checkRes);
  sleep(1);
}


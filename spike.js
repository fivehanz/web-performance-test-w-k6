import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '2m', target: 1500 }, // fast ramp-up to a high point
    { duration: '1m', target: 0 },  // quick ramp-down to 0 users
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


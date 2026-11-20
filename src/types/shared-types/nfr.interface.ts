export interface NFRMetric {
  metricName: string;
  target: string;
  measured: string;
  status: 'PASSED' | 'FAILED' | 'WARNING';
  details?: Record<string, any>;
}

export interface NFRReport {
  timestamp: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  metrics: NFRMetric[];
  latencyBenchmark: {
    samples: number;
    p50Ms: number;
    p95Ms: number;
    p99Ms: number;
    minMs: number;
    maxMs: number;
    targetP95Ms: number;
  };
  throughputBenchmark: {
    recordsIngested: number;
    durationMs: number;
    recordsPerSec: number;
    targetRps: number;
  };
  resilienceCheck: {
    fallbackTriggered: boolean;
    circuitBreakerState: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    dataIntegrity: '100%' | string;
  };
}

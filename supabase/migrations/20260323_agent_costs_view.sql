-- ═══════════════════════════════════════════════════════
-- PHASE 2C: Agent Costs Aggregation View
-- Rollup of agent_logs by agent + day for dashboard KPIs
-- ═══════════════════════════════════════════════════════

CREATE OR REPLACE VIEW agent_costs AS
SELECT
  agent_name,
  COUNT(*) as total_calls,
  SUM(cost_usd) as total_cost,
  SUM(input_tokens) as total_input,
  SUM(output_tokens) as total_output,
  AVG(duration_ms) as avg_latency,
  COUNT(*) FILTER (WHERE success = true)::float / NULLIF(COUNT(*), 0) as success_rate,
  date_trunc('day', created_at) as day
FROM agent_logs
GROUP BY agent_name, date_trunc('day', created_at);

/*
  # Create leaderboard_runs table

  1. New Tables
    - `leaderboard_runs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, not null)
      - `username` (text, not null)
      - `algorithm` (text, not null) - e.g. 'bfs', 'dfs', 'dijkstra', 'astar'
      - `completion_time_ms` (double precision, not null) - execution time in milliseconds
      - `nodes_explored` (integer, not null) - number of grid cells explored
      - `efficiency_score` (integer, not null) - 0-100 score based on exploration efficiency
      - `grid_size` (integer, default 20) - grid dimension
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `leaderboard_runs`
    - SELECT: anyone authenticated can read all runs
    - INSERT: authenticated users can insert their own runs
    - UPDATE/DELETE: users can only modify their own runs

  3. Indexes
    - Index on `efficiency_score` desc for top-runs queries
    - Index on `algorithm` for filtering
    - Index on `user_id` for ownership checks
*/

CREATE TABLE IF NOT EXISTS leaderboard_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  algorithm text NOT NULL,
  completion_time_ms double precision NOT NULL,
  nodes_explored integer NOT NULL,
  efficiency_score integer NOT NULL,
  grid_size integer NOT NULL DEFAULT 20,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leaderboard_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all runs"
  ON leaderboard_runs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own runs"
  ON leaderboard_runs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own runs"
  ON leaderboard_runs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own runs"
  ON leaderboard_runs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_leaderboard_efficiency ON leaderboard_runs (efficiency_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_algorithm ON leaderboard_runs (algorithm);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user ON leaderboard_runs (user_id);

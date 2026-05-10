#include <algorithm>
#include <chrono>
#include <cmath>
#include <functional>
#include <iomanip>
#include <iostream>
#include <limits>
#include <queue>
#include <random>
#include <stack>
#include <string>
#include <tuple>
#include <utility>
#include <vector>

using namespace std;
using Grid = vector<vector<int>>; // 0=open, 1=wall

struct Result {
    bool found;
    int explored;
};

int manhattan(int r1, int c1, int r2, int c2) {
    return abs(r1 - r2) + abs(c1 - c2);
}

Result bfs(const Grid& g, pair<int, int> s, pair<int, int> t) {
    int R = (int)g.size(), C = (int)g[0].size();
    vector<vector<char>> vis(R, vector<char>(C, 0));
    queue<pair<int, int>> q;
    q.push(s);
    vis[s.first][s.second] = 1;
    int explored = 0;
    int dr[4] = {-1, 1, 0, 0};
    int dc[4] = {0, 0, -1, 1};

    while (!q.empty()) {
      auto [r, c] = q.front(); q.pop();
      explored++;
      if (make_pair(r, c) == t) return {true, explored};
      for (int k = 0; k < 4; ++k) {
        int nr = r + dr[k], nc = c + dc[k];
        if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
        if (g[nr][nc] == 1 || vis[nr][nc]) continue;
        vis[nr][nc] = 1;
        q.push({nr, nc});
      }
    }
    return {false, explored};
}

Result dfs(const Grid& g, pair<int, int> s, pair<int, int> t) {
    int R = (int)g.size(), C = (int)g[0].size();
    vector<vector<char>> vis(R, vector<char>(C, 0));
    stack<pair<int, int>> st;
    st.push(s);
    int explored = 0;
    int dr[4] = {-1, 1, 0, 0};
    int dc[4] = {0, 0, -1, 1};

    while (!st.empty()) {
      auto [r, c] = st.top(); st.pop();
      if (vis[r][c]) continue;
      vis[r][c] = 1;
      explored++;
      if (make_pair(r, c) == t) return {true, explored};
      for (int k = 3; k >= 0; --k) {
        int nr = r + dr[k], nc = c + dc[k];
        if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
        if (g[nr][nc] == 1 || vis[nr][nc]) continue;
        st.push({nr, nc});
      }
    }
    return {false, explored};
}

Result dijkstra(const Grid& g, pair<int, int> s, pair<int, int> t) {
    int R = (int)g.size(), C = (int)g[0].size();
    const int INF = numeric_limits<int>::max();
    vector<vector<int>> dist(R, vector<int>(C, INF));
    using State = tuple<int, int, int>; // d,r,c
    priority_queue<State, vector<State>, greater<State>> pq;
    dist[s.first][s.second] = 0;
    pq.push({0, s.first, s.second});
    int explored = 0;
    int dr[4] = {-1, 1, 0, 0};
    int dc[4] = {0, 0, -1, 1};

    while (!pq.empty()) {
      auto [d, r, c] = pq.top(); pq.pop();
      if (d != dist[r][c]) continue;
      explored++;
      if (make_pair(r, c) == t) return {true, explored};
      for (int k = 0; k < 4; ++k) {
        int nr = r + dr[k], nc = c + dc[k];
        if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
        if (g[nr][nc] == 1) continue;
        int nd = d + 1;
        if (nd < dist[nr][nc]) {
          dist[nr][nc] = nd;
          pq.push({nd, nr, nc});
        }
      }
    }
    return {false, explored};
}

Result astar(const Grid& g, pair<int, int> s, pair<int, int> t) {
    int R = (int)g.size(), C = (int)g[0].size();
    const int INF = numeric_limits<int>::max();
    vector<vector<int>> bestG(R, vector<int>(C, INF));
    using State = tuple<int, int, int, int>; // f,g,r,c
    priority_queue<State, vector<State>, greater<State>> pq;
    bestG[s.first][s.second] = 0;
    pq.push({manhattan(s.first, s.second, t.first, t.second), 0, s.first, s.second});
    int explored = 0;
    int dr[4] = {-1, 1, 0, 0};
    int dc[4] = {0, 0, -1, 1};

    while (!pq.empty()) {
      auto [f, gcost, r, c] = pq.top(); pq.pop();
      (void)f;
      if (gcost != bestG[r][c]) continue;
      explored++;
      if (make_pair(r, c) == t) return {true, explored};
      for (int k = 0; k < 4; ++k) {
        int nr = r + dr[k], nc = c + dc[k];
        if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
        if (g[nr][nc] == 1) continue;
        int ng = gcost + 1;
        if (ng < bestG[nr][nc]) {
          bestG[nr][nc] = ng;
          int nf = ng + manhattan(nr, nc, t.first, t.second);
          pq.push({nf, ng, nr, nc});
        }
      }
    }
    return {false, explored};
}

Grid makeGrid(int R, int C, double wallProb, unsigned seed) {
    mt19937 rng(seed);
    uniform_real_distribution<double> p(0.0, 1.0);
    Grid g(R, vector<int>(C, 0));
    for (int r = 0; r < R; ++r) {
      for (int c = 0; c < C; ++c) {
        g[r][c] = (p(rng) < wallProb) ? 1 : 0;
      }
    }
    g[0][0] = 0;
    g[R - 1][C - 1] = 0;
    return g;
}

template <typename F>
void bench(const string& name, F fn, const Grid& g, pair<int, int> s, pair<int, int> t, int runs) {
    long long totalNs = 0;
    int explored = 0;
    bool found = false;

    for (int i = 0; i < runs; ++i) {
      auto start = chrono::high_resolution_clock::now();
      Result r = fn(g, s, t);
      auto end = chrono::high_resolution_clock::now();
      totalNs += chrono::duration_cast<chrono::nanoseconds>(end - start).count();
      explored = r.explored;
      found = r.found;
    }

    double avgMs = (double)totalNs / runs / 1e6;
    cout << left << setw(10) << name
         << " found=" << (found ? "yes" : "no")
         << " explored=" << explored
         << " avg_ms=" << fixed << setprecision(3) << avgMs
         << '\n';
}

int main() {
    const int R = 120, C = 120, runs = 30;
    Grid g = makeGrid(R, C, 0.28, 42);
    pair<int, int> start = {0, 0}, goal = {R - 1, C - 1};

    cout << "Benchmark on " << R << "x" << C << " grid (runs=" << runs << ")\n";
    bench("BFS", bfs, g, start, goal, runs);
    bench("DFS", dfs, g, start, goal, runs);
    bench("Dijkstra", dijkstra, g, start, goal, runs);
    bench("A*", astar, g, start, goal, runs);
    return 0;
}

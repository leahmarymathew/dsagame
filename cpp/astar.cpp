#include <algorithm>
#include <cmath>
#include <iostream>
#include <limits>
#include <queue>
#include <utility>
#include <vector>

using namespace std;

struct Node {
    int f, g, r, c;
    bool operator>(const Node& o) const { return f > o.f; }
};

int manhattan(int r1, int c1, int r2, int c2) {
    return abs(r1 - r2) + abs(c1 - c2);
}

vector<pair<int, int>> aStar(const vector<vector<int>>& grid, pair<int, int> start, pair<int, int> goal) {
    int rows = (int)grid.size(), cols = rows ? (int)grid[0].size() : 0;
    vector<pair<int, int>> empty;
    if (!rows || !cols) return empty;

    const int INF = numeric_limits<int>::max();
    vector<vector<int>> g(rows, vector<int>(cols, INF));
    vector<vector<pair<int, int>>> parent(rows, vector<pair<int, int>>(cols, {-1, -1}));
    priority_queue<Node, vector<Node>, greater<Node>> pq;

    auto [sr, sc] = start;
    auto [gr, gc] = goal;
    g[sr][sc] = 0;
    pq.push({manhattan(sr, sc, gr, gc), 0, sr, sc});

    int dr[4] = {-1, 1, 0, 0};
    int dc[4] = {0, 0, -1, 1};

    while (!pq.empty()) {
        Node cur = pq.top();
        pq.pop();

        if (cur.r == gr && cur.c == gc) break;
        if (cur.g != g[cur.r][cur.c]) continue;

        for (int k = 0; k < 4; ++k) {
            int nr = cur.r + dr[k], nc = cur.c + dc[k];
            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (grid[nr][nc] == 1) continue;

            int ng = cur.g + 1;
            if (ng < g[nr][nc]) {
                g[nr][nc] = ng;
                parent[nr][nc] = {cur.r, cur.c};
                int f = ng + manhattan(nr, nc, gr, gc);
                pq.push({f, ng, nr, nc});
            }
        }
    }

    if (g[gr][gc] == INF) return empty;

    vector<pair<int, int>> path;
    for (pair<int, int> at = goal; at.first != -1; at = parent[at.first][at.second]) {
        path.push_back(at);
        if (at == start) break;
    }
    reverse(path.begin(), path.end());
    return path;
}

int main() {
    vector<vector<int>> grid = {
        {0, 0, 0, 0, 0},
        {1, 1, 0, 1, 0},
        {0, 0, 0, 1, 0},
        {0, 1, 1, 1, 0},
        {0, 0, 0, 0, 0}
    };

    auto path = aStar(grid, {0, 0}, {4, 4});
    if (path.empty()) {
        cout << "No path\n";
        return 0;
    }

    for (auto [r, c] : path) cout << '(' << r << ',' << c << ") ";
    cout << '\n';
    return 0;
}

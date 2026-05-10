#include <iostream>
#include <limits>
#include <queue>
#include <utility>
#include <vector>

using namespace std;

vector<int> dijkstra(const vector<vector<pair<int, int>>>& graph, int src) {
    int n = (int)graph.size();
    const int INF = numeric_limits<int>::max();
    vector<int> dist(n, INF);

    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    dist[src] = 0;
    pq.push({0, src});

    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (d != dist[u]) continue;

        for (auto [v, w] : graph[u]) {
            if (d + w < dist[v]) {
                dist[v] = d + w;
                pq.push({dist[v], v});
            }
        }
    }

    return dist;
}

int main() {
    // graph[u] = {v, weight}
    vector<vector<pair<int, int>>> graph = {
        {{1, 4}, {2, 1}},
        {{3, 1}},
        {{1, 2}, {3, 5}},
        {}
    };

    vector<int> dist = dijkstra(graph, 0);
    for (int i = 0; i < (int)dist.size(); ++i) {
        cout << "dist[" << i << "] = " << dist[i] << '\n';
    }
    return 0;
}

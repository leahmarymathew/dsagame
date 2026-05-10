#include <iostream>
#include <stack>
#include <vector>

using namespace std;

vector<int> dfsTraversal(const vector<vector<int>>& graph, int start) {
    int n = static_cast<int>(graph.size());
    vector<int> order;
    if (start < 0 || start >= n) return order;

    vector<bool> visited(n, false);
    stack<int> st;
    st.push(start);

    while (!st.empty()) {
        int node = st.top();
        st.pop();

        if (visited[node]) continue;
        visited[node] = true;
        order.push_back(node);

        for (int i = static_cast<int>(graph[node].size()) - 1; i >= 0; --i) {
            int next = graph[node][i];
            if (!visited[next]) st.push(next);
        }
    }

    return order;
}

int main() {
    // Example graph (0..5)
    vector<vector<int>> graph = {
        {1, 2},
        {3, 4},
        {5},
        {},
        {5},
        {}
    };

    vector<int> order = dfsTraversal(graph, 0);
    for (int node : order) cout << node << ' ';
    cout << '\n';
    return 0;
}

onmessage = function (e) {
    const { map, ghostPosition, targetPosition, rows, cols, ghostIndex } = e.data;
    
    // Reconstruct the 2D map
    const reconstructedMap = [];
    for (let i = 0; i < rows; i++) {
        reconstructedMap.push(...map.slice(i * cols, ((i + 1) * cols) - 1));
    }
    
    const directions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 }, 
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];
  
    const bfs = (map, start, target) => {
      const rows = map.length;
      const cols = map[0].length;
  
      const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
      const queue = [{ position: start, path: [] }];

      visited[start.y][start.x] = true;
  
      while (queue.length > 0) {
        const { position, path } = queue.shift();
  
        if (position.x === target.x && position.y === target.y) {
          return path;
        }
  
        for (const dir of directions) {
          const nextX = position.x + dir.x;
          const nextY = position.y + dir.y;
  
          if (
            nextX >= 0 &&
            nextX < cols &&
            nextY >= 0 &&
            nextY < rows &&
            !visited[nextY][nextX] &&
            ['.', 'b', '^', ' ', 'X', 'M'].includes(map[nextY][nextX])
          ) {
            visited[nextY][nextX] = true;
            queue.push({
              position: { x: nextX, y: nextY },
              path: [...path, { x: nextX, y: nextY }],
            });
          }
        }
      }
      return null; // No path found
    };
  
    const path = bfs(reconstructedMap, ghostPosition, targetPosition);

    postMessage({ path, ghostIndex });
  };
  
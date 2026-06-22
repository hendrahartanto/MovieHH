using custom hook in to manage websockets is a design pattern that follow industry best practices

1. separation of concrens: to isolate the socket & real-time concrens completely
2. precise lifecycle management (avoiding memory leaks): websockets are persistent, stateful connections. utilizing useEffect for guarantee cleanup when component unmount

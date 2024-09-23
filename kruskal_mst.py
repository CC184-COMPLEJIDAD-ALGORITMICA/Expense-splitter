import json
import sys
from decimal import Decimal, getcontext

# Configurar la precisión decimal para evitar errores de redondeo
getcontext().prec = 10

class DisjointSet:
    def __init__(self, vertices):
        self.parent = {v: v for v in vertices}
        self.rank = {v: 0 for v in vertices}

    def find(self, item):
        if self.parent[item] != item:
            self.parent[item] = self.find(self.parent[item])
        return self.parent[item]

    def union(self, x, y):
        xroot = self.find(x)
        yroot = self.find(y)
        if self.rank[xroot] < self.rank[yroot]:
            self.parent[xroot] = yroot
        elif self.rank[xroot] > self.rank[yroot]:
            self.parent[yroot] = xroot
        else:
            self.parent[yroot] = xroot
            self.rank[xroot] += 1

def calculate_transfers(nodes, balance_option):
    transfers = []
    if balance_option['type'] == 'equalize':
        total_balance = sum(Decimal(str(node['balance'])) for node in nodes)
        target_balance = total_balance / Decimal(str(len(nodes)))
        
        nodes_copy = [node.copy() for node in nodes]
        
        for node in nodes_copy:
            node['balance'] = Decimal(str(node['balance']))
        
        while True:
            nodes_copy.sort(key=lambda x: x['balance'])
            min_node = nodes_copy[0]
            max_node = nodes_copy[-1]
            
            if abs(max_node['balance'] - min_node['balance']) < Decimal('0.01'):
                break
            
            transfer_amount = min(max_node['balance'] - target_balance, target_balance - min_node['balance'])
            transfers.append((max_node['name'], min_node['name'], float(transfer_amount)))
            
            max_node['balance'] -= transfer_amount
            min_node['balance'] += transfer_amount
    
    elif balance_option['type'] == 'empty':
        target_account = next(node for node in nodes if node['name'] == balance_option['targetAccount'])
        amount_to_distribute = Decimal(str(target_account['balance']))
        remaining_nodes = [node for node in nodes if node['name'] != target_account['name']]
        amount_per_node = amount_to_distribute / Decimal(str(len(remaining_nodes)))
        
        for node in remaining_nodes:
            transfers.append((target_account['name'], node['name'], float(amount_per_node)))
    
    return transfers

def kruskal_mst(nodes, balance_option=None):
    logs = []
    logs.append("Iniciando algoritmo de Kruskal MST")
    
    if balance_option:
        logs.append(f"Opción de balance seleccionada: {balance_option['type']}")
        transfers = calculate_transfers(nodes, balance_option)
        edges = [(t[0], t[1], t[2], 0) for t in transfers]
        logs.append(f"Transferencias calculadas: {transfers}")
    else:
        logs.append("Usando cálculo de diferencias de saldo estándar")
        edges = []
        for i in range(len(nodes)):
            for j in range(i+1, len(nodes)):
                edges.append((nodes[i]['name'], nodes[j]['name'], abs(nodes[i]['balance'] - nodes[j]['balance']), 0))

    logs.append(f"Aristas iniciales: {edges}")
    
    # Paso 1 del algoritmo de Kruskal: Ordenar las aristas por peso
    edges.sort(key=lambda x: x[2])
    logs.append(f"Aristas ordenadas: {edges}")

    vertices = set(node['name'] for node in nodes)
    ds = DisjointSet(vertices)
    mst = []

    # Paso 2 del algoritmo de Kruskal: Construir el MST
    for edge in edges:
        if len(mst) == len(vertices) - 1:
            break  # El MST está completo
        if ds.find(edge[0]) != ds.find(edge[1]):
            # Esta arista no forma un ciclo, la añadimos al MST
            ds.union(edge[0], edge[1])
            mst.append(edge)
            logs.append(f"Añadida arista al MST: {edge}")
        else:
            logs.append(f"Arista {edge} descartada (formaría un ciclo)")

    # Actualizar los balances basados en el MST encontrado
    logs.append("Actualizando balances de los nodos basados en el MST")
    updated_nodes = {node['name']: node.copy() for node in nodes}
    for edge in mst:
        from_node = updated_nodes[edge[0]]
        to_node = updated_nodes[edge[1]]
        amount = edge[2]
        from_node['balance'] -= amount
        to_node['balance'] += amount
        logs.append(f"Transferencia: {edge[0]} -> {edge[1]}, Cantidad: {amount}")

    # Calcular el balance final para cada nodo
    total_balance = sum(node['balance'] for node in updated_nodes.values())
    target_balance = total_balance / len(updated_nodes)
    for node in updated_nodes.values():
        node['final_balance'] = node['balance']
        node['balance'] = target_balance

    logs.append("Proceso de Kruskal MST completado")
    return mst, list(updated_nodes.values()), logs

if __name__ == "__main__":
    input_file = sys.argv[1]
    with open(input_file, 'r') as f:
        data = json.load(f)
    
    nodes = data['nodes']
    balance_option = data.get('balanceOption')

    mst, updated_nodes, logs = kruskal_mst(nodes, balance_option)
    
    output = {
        "mst": [{"from": edge[0], "to": edge[1], "weight": edge[2], "cost": edge[3]} for edge in mst],
        "totalWeight": sum(edge[2] for edge in mst),
        "totalCost": sum(edge[3] for edge in mst),
        "updatedNodes": updated_nodes,
        "logs": logs
    }
    
    print(json.dumps(output))

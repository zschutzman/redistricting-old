from graphreportr import GraphReportr
import networkx as nx
import csv
import json
from datetime import datetime
import numpy as np
import sklearn



def collect():
    bads = 0
    vecs = []
    keys = []
    outfile = open("rook_stats.csv",'w')
    writer = csv.writer(outfile, delimiter='\t')
    for f in glob.glob('./vtd-adjacency-graphs-master/vtd-adjacency-graphs/*/rook.json'):
        tic = datetime.now()
        st = f[51:53]
        
        districts = set()
        with open(f) as h:
            data = json.load(h)
        g  = nx.readwrite.json_graph.adjacency_graph(data)
        try:
            for node in g.nodes(data=True):
                districts.add(node[1]['CD'])
        except: 
            continue
        for d in districts:
            dist = g.subgraph([n[0] for n in g.nodes(data=True) if n[1]['CD'] == d])
            rpt = GraphReportr(dist)
            if not nx.is_connected(dist):
                #print("NC", f, bads+1)
                bads+=1
            else:
                v = [st,d]
                v.append(rpt.get_vector())
                writer.writerow(v)

                
            print("Took {} to do {} - {}".format(datetime.now()-tic, st,d))
    outfile.close()
    
    
def get_areas():
        bads = 0
    areas = {}
    for f in glob.glob('./vtd-adjacency-graphs-master/vtd-adjacency-graphs/*/rook.json'):
        tic = datetime.now()
        st = f[51:53]
        
        districts = set()
        with open(f) as h:
            data = json.load(h)
        g  = nx.readwrite.json_graph.adjacency_graph(data)
        try:
            for node in g.nodes(data=True):
                districts.add(node[1]['CD'])
                chk = node[1]['ALAND10']
                chk = node[1]['AWATER10']
        except: 
            continue
        for d in districts:
           
            if not nx.is_connected(dist):
                #print("NC", f, bads+1)
                bads+=1
            else:
                ar = sum(float(n[1]['ALAND10'])+float(n[1]['AWATER10']) for n in g.nodes(data=True) if n[1]['CD'] == d])                
                
                areas[(st,cd)]=ar

                
            print("Took {} to do {} - {}".format(datetime.now()-tic, st,d))
    np.save('area_dct.npy',areas)


def main():
    get_areas()
    
if __name__ == '__main__':
    main()

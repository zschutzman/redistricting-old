import json
import networkx
import warnings
import numpy as np
nx = networkx
import random
import copy
import glob
from multiprocessing.dummy import Pool
import time
import sklearn
from datetime import datetime
import csv


class GraphReportr:
    ''' A class to modularize graph statistics'''
    def __init__(self, graph):
        ''' Takes either a networkx graph object or a .json file to 
            convert to a networkx graph.
        '''
        if isinstance(graph, networkx.classes.graph.Graph):
            self.graph = graph
        elif isinstance(graph, str):
            try:
                with open(graph) as f:
                   data = json.load(f)
                self.graph = nx.readwrite.json_graph.adjacency_graph(data)
            except:
                raise ValueError("FILES MUST BE GIVEN AS JSON ADJACENCY GRAPHS")
                
        else:
            raise ValueError("Please give a graph either as a NetworkX object or a .json file.  Gave a {}".format(type(graph)))
        
        # we store diameter because it is kind of slow to compute
        self.diam = -1

    
    
    
    
    def size(self):
        ''' gives the number of vertices and edges of the graph'''
        return len(nx.nodes(self.graph)), len(nx.edges(self.graph))
    
    
    
    def diameter(self):
        '''returns the diameter (longest shortest path) of the graph'''
        if self.diam == -1:
            if nx.is_connected(self.graph):
                self.diam = nx.diameter(self.graph)
            else:
                self.diam = 'inf'
                warnings.warn("Graph is not connected. Diameter set to 'inf'", UserWarning)

        return self.diam
    
    def clustering(self):
        ''' returns the average clustering of the graph, i.e. over all triples of nodes,
            for the triples which contain two edges, what proportion are complete triangles
        '''
        return nx.average_clustering(self.graph)
    
    def triangles(self):
        ''' returns the number of triangles (induced K_3 subgraphs) of the graph'''
        return sum(nx.triangles(self.graph).values())/3
 
 
    def density(self):
        '''returns the edge density of the graph - the 
           fraction of possible edges which are present
        '''
        return nx.density(self.graph)
 
    
    
    def connectivity(self):
        ''' gives the vertex and edge connectivity of the graph. this is the fewest number
            of vertices/edges which must be deleted to disconnect the graph
        '''
        return nx.node_connectivity(self.graph), nx.edge_connectivity(self.graph)
    
    def spectral_gap(self):
        ''' returns the spectral gap of a graph, which is the second laplacian eigenvalue, the
            difference between the largest two adjacency eigenvalues, or the second largest
            transition matrix eigenvalue.  it measures the algebraic connnectivity of the graph
        '''
         
        l = nx.laplacian_spectrum(self.graph)
        l.sort()
        return l[1]
    
    def log_num_trees(self):
        l = nx.laplacian_spectrum(self.graph)
        l.sort()
        return sum([np.log(x) for x in l[1:]])
    
    def estrada_index(self):
        ''' returns the estrada index, which is a measure of the 'walk-iness' of a graph. it is the trace
            of the matrix exponential of the graph's adjacency matrix
        '''
        return nx.estrada_index(self.graph)
    
        
        
    def deg_seq(self):
        ''' returns a list of degrees of the graph. can be passed into a pyplot histogram '''
        return list([nbrs[1] for nbrs in self.graph.degree()])
    
    
    
    def cov_time(self, iters):
        ''' performs [iters] random walks on the graph and returns the mean and std dev of
            the number of times needed to visit every vertex.  returns None if the
            graph is not connected
        '''
        if not nx.is_connected(self.graph):
            warnings.warn("Graph is not connected - returning None", UserWarning)
            return None
        
        
        def map_samp(i):
        
        
            visited = set()
            start = random.choice(list(self.graph.nodes()))
            curr = start
            visited.add(curr)
            count = 0
            while len(visited) < len(self.graph.nodes()):
                curr = random.choice(list(self.graph[curr]))
                visited.add(curr)
                count+=1
            return count
        
        pool = Pool(4)
        samp = pool.map(map_samp, range(iters))
        return np.mean(samp), np.std(samp)
    
    
    def get_center(self):
        ''' returns the center of the graph - the vertices for which the eccentricity equals
            the graph radius
        '''
        if self.diameter() != 'inf':
            return nx.Graph(self.graph.subgraph(nx.center(self.graph)))
        else:
            return None
    
    def get_without_center(self):
        ''' returns a graph object which is the original graph with the center removed '''
        cg = nx.center(self.graph)
        rg = copy.deepcopy(self.graph)
        for n in cg:
            rg.remove_node(n)
        return rg
    
    
    
    
    
    def get_light_report(self):
        ''' returns a string report with the 'easy' things to compute:
                size, diameter, triangles, density, connectivity, clustering, spectral gap, estrada index
        '''
        sz = self.size()
        tri = self.triangles()
        den = self.density()
        clus = self.clustering()
        sg = self.spectral_gap()
        ei = self.estrada_index()

        
        s = ("Vertices, Edges: {}, {}\n"
             "Triangles: {}\n"
             "Edge Density: {}\n"
             "Avg. Clustering: {}\n"
             "Spectral Gap: {}\n"
             "Estrada Index: {}").format(sz[0],sz[1],tri,den,clus,sg,ei)
        return s

        
    def get_heavy_report(self):
        ''' does the light report plus:
            covering time, size of center, is center connected, does deleting center disconnect
        '''
        d = self.diameter()
        conn = self.connectivity()

        ct = self.cov_time(100)

        crpt = GraphReportr(self.get_center())
        csz = crpt.size()
        ccon = nx.is_connected(crpt.graph)
        nocen = nx.is_connected(self.get_without_center())


        
        
        
        
        s = self.get_light_report()
        s += ( "Diameter: {}\n"
              "Vertex, Edge Connectivity: {}, {}\n"
             "Mean, Std Dev Covering Time (100 iterations): {}, {}\n"
              "Vertices, Edges in Center: {}, {}\n"
              "Is Center Connected: {}\n"
              "Is Graph Minus Center Connected: {}").format(d,conn[0],conn[1],ct[0],ct[1],csz[0],csz[1],ccon,nocen)
    
        return s




    def get_vector(self):
        ''' returns a list with each of the values in the same order as get_heavy_report() '''
        toc = datetime.now()
        sz = self.size()
        #print(datetime.now()-toc,'s')
        tri = self.triangles()
        #print(datetime.now()-toc,'t')
        den = self.density()
        #print(datetime.now()-toc,'d')
        clus = self.clustering()
        #print(datetime.now()-toc,'l')
        sg = self.spectral_gap()
        #print(datetime.now()-toc,'g')
        ei = self.estrada_index()
        #print(datetime.now()-toc,'e')
        d = self.diameter()
        #print(datetime.now()-toc,'m')
        #conn = self.connectivity()
        
        ct = self.cov_time(10)
        #print(datetime.now()-toc,'w')
        crpt = GraphReportr(self.get_center())
        #print(datetime.now()-toc)
        csz = crpt.size()
        #print(datetime.now()-toc,'z')
        ccon = nx.is_connected(crpt.graph)
        #nocen = nx.is_connected(self.get_without_center())
        #print(datetime.now()-toc,'n')
        numtrees = self.log_num_trees()
        #print(datetime.now()-toc,'r')

        return [sz[0],
                sz[1],
                tri,
                den,
                clus,
                sg,
                ei,
                d,
                #conn[0],
                #conn[1],
                ct[0],
                ct[1],
                numtrees,
                csz[0],
                csz[1],
                int(ccon)
                #int(nocen)
                
                ]






def collect():
    bads = 0
    vecs = []
    keys = []
    #outfile = open("rook_stats.csv",'w')
    #writer = csv.writer(outfile, delimiter='\t')
    for f in glob.glob('./vtd-adjacency-graphs-master/vtd-adjacency-graphs/*/rook.json'):
        tic = datetime.now()
        st = f[51:53]
        if st !='36': continue
        else: print("NY")
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
            #rpt = GraphReportr(dist)
            
            if not nx.is_connected(dist):
                print("NOT CONNECTED : {}".format(d))
                bads+=1
            else:
                v = [st,d]
                #v+=rpt.get_vector()
                #writer.writerow(v)

                
            print("Took {} to do {} - {}".format(datetime.now()-tic, st,d))
   # outfile.close()
        


def analyze():
    return np.loadtxt("vecs")
    
if __name__ == '__main__':

    collect()

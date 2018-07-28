





print("IMPORTS")
import numpy as np
import math
import itertools
import time
from multiprocessing import Pool
import scipy.sparse
from IPython.display import clear_output
from multiprocessing.dummy import Pool as ThreadPool
import csv
import ast
import collections
import random
import matplotlib.pyplot as plt
import networkx as nx
import collections

#Given an omino (nxn binary matrix), checks if it is valid
# i.e. all ones are rook-adjacent and contiguous

def valid_omino(omino):
    '''
    takes an omino as input and validates it
    returns a boolean
    '''
    
    k = omino.shape[0]
    check = np.zeros([k,k]) - omino
    
    
    _f  = False
    for i in range(k):
        for j in range(k):
            if check[i,j] == -1:
                if not _f:
                    _f  = True
                    check[i,j] = 1
    if not _f:
        print("ABORT")
        return
    
    # I know this should require fewer passes, but...
    for iter in range(k**2):
        for i in range(k):
            for j in range(k):
                if check[i,j] == 1:
                    if i != 0:
                        check[i-1,j] = check[i-1,j]**2

                    if i != k-1:
                        check[i+1,j] = check[i+1,j]**2

                    if j != 0:
                        check[i,j-1] = check[i,j-1]**2

                    if j != k-1:
                        check[i,j+1] = check[i,j+1]**2
                    
    return np.sum(check) == np.sum(omino)


# given a list of (r,c) index pairs, generates an omino
# if the omino isn't valid, returns the 0x0 0 matrix
def make_omino(inds, dim):
    '''
    takes a set of indices (x,y) to be set to 1
    makes a matrix of size dim x dim
    returns the matrix if it is a valid omino
    returns the empty zeros matrix otherwise
    
    '''
    p = np.zeros([dim,dim])
    for loc in inds:
        p[loc[0],loc[1]] = 1
    
    if valid_omino(p):
        return p
    else:
        return np.zeros([0,0])

    

# generates all of the <cells>-ominos in the <grid>^2 grid
def make_omino_set(cells, grid):
    '''
    takes two numbers, cells and grid and returns a list
    of all the valid cells-ominos which fit in the
    grid^2 grid
    
    returns a list of valid ominos    
    '''
    
    if grid % cells != 0:
        print("WARNING - <cells> doesnt divide <grid>")
        #return []
    
    
    pair_idx = []
    for i in range(grid):
        for j in range(grid):
            pair_idx.append((i,j))
    
    
    ominos = []
    
    for t in (l for l in itertools.combinations(pair_idx, cells)):
        p = make_omino(t,grid)
        if p.shape[0] != 0:
            ominos.append(p)
    
    return ominos

print("READING")
n= make_omino_set(5,5)
graph = np.load("dict_55.npy")[()]
equivs = np.load("d8_dict_55.npy")[()]
classes = set()

for k,v in equivs.items():
    
    if len(classes.intersection(v)) == 0:
        classes.add(k)
        
reps = {}
for k,v in equivs.items():
    for u in v:
        for c in classes:
            if c==u:
                reps[k]=c
                
                
quot_graph = collections.defaultdict(set)
for k,v in graph.items():
    for u in v:
        quot_graph[reps[k]].add(reps[u])

        
print(len(classes))



G = nx.to_networkx_graph(quot_graph)

G2 = nx.to_networkx_graph(graph)


'''
from bokeh.sampledata import gapminder
hv.extension('bokeh')

# Switch to sending data 'live' and using the scrubber widget
%output widgets='live' holomap='scrubber'
%output size=300

#print(planarity.is_planar(G))
'''
seen = {}
counter = 0
for o in G2.nodes(data=True):
    o[1]['orbit'] = len(tuple(equivs[o[0]]))
    #if o[0] in classes:
    if reps[o[0]] not in seen.values():
        o[1]['Type'] = counter
        
        seen[counter] = reps[o[0]]
        counter += 1
    else:
        for k,v in seen.items():
            if reps[o[0]] == v:
                o[1]['Type'] = k
    o[1]['deg'] = str(len(list(G2.neighbors(o[0]))))
    o[1]['tup'] = o[0]
    o[1]['str_rep']  = str(n[o[0][0]] + 2* n[o[0][1]] + 3*n[o[0][2]] + 4*n[o[0][3]] + 5*n[o[0][4]])[1:-1]
    o[1]['str_rep'] = o[1]['str_rep'].replace('[','')
    o[1]['str_rep'] = o[1]['str_rep'].replace(']','')
    
    
    o[1]['html_rep'] = o[1]['str_rep'].replace('\n','<br/>')
    
    o[1]['html_rep'] = o[1]['html_rep'].replace('1.', '<span style="color:#73C6B6">&#9724;</span>')
    o[1]['html_rep'] = o[1]['html_rep'].replace('2.', '<span style="color:#F4D03F">&#9724;</span>')
    o[1]['html_rep'] = o[1]['html_rep'].replace('3.', '<span style="color:#CD6155">&#9724;</span>')
    o[1]['html_rep'] = o[1]['html_rep'].replace('4.', '<span style="color:#A569BD">&#9724;</span>')
    o[1]['html_rep'] = o[1]['html_rep'].replace('5.', '<span style="color:#4682B4">&#9724;</span>')

    o[1]['str_rep'] = o[1]['str_rep'].replace('.','')




for o in G.nodes(data=True):
    o[1]['orbit'] = len(tuple(equivs[o[0]]))
    o[1]['tup'] = o[0]

    for k,v in seen.items():
        if reps[o[0]] == v:
            o[1]['Type'] = k
    o[1]['str_rep']  = str(n[o[0][0]] + 2* n[o[0][1]] + 3*n[o[0][2]] + 4*n[o[0][3]] +  5*n[o[0][4]]   )[1:-1]
    o[1]['str_rep'] = o[1]['str_rep'].replace('[','')
    o[1]['str_rep'] = o[1]['str_rep'].replace(']','')
    
    
    o[1]['html_rep'] = o[1]['str_rep'].replace('\n','<br/>')
    
    o[1]['html_rep'] = o[1]['html_rep'].replace('1.', '<span style="color:#73C6B6">&#9724;</span>')
    o[1]['html_rep'] = o[1]['html_rep'].replace('2.', '<span style="color:#F4D03F">&#9724;</span>')
    o[1]['html_rep'] = o[1]['html_rep'].replace('3.', '<span style="color:#CD6155">&#9724;</span>')
    o[1]['html_rep'] = o[1]['html_rep'].replace('4.', '<span style="color:#A569BD">&#9724;</span>')
    o[1]['html_rep'] = o[1]['html_rep'].replace('5.', '<span style="color:#4682B4">&#9724;</span>')

    o[1]['str_rep'] = o[1]['str_rep'].replace('.','')



#H=hv.Graph.from_networkx(G, nx.layout.spring_layout).redim.range(**padding)
#I=hv.Graph.from_networkx(G2, nx.layout.spring_layout).redim.range(**padding).options(color_index='Type', cmap='tab20')
#I


print("ELECS")

for i in range(26):
    for o in G2.nodes(data=True):
        o[1]['w'+str(i)] = [0,0,0,0,0,0]



for i in range(4):
    for o in G2.nodes(data=True):
        ck = o[1]['str_rep'].replace(" ",'').replace("\n",'')
        

        for l in itertools.combinations(range(25),i):
        
            s = ''
            for j in l:
                s += ck[j]
            
            w = sum([s.count(str(k+1)) >= 3  for k in  range(5)   ]       )
            
            o[1]['w'+str(i)][w]+=1
    print("DONE {}".format(i))






nx.write_gpickle(G2,'meta_with_elections')


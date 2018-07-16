"""Example of writing JSON format graph data and using the D3 Javascript library to produce an HTML/Javascript drawing.
"""
#    Copyright (C) 2011-2012 by
#    Aric Hagberg <hagberg@lanl.gov>
#    Dan Schult <dschult@colgate.edu>
#    Pieter Swart <swart@lanl.gov>
#    All rights reserved.
#    BSD license.
__author__ = """Aric Hagberg <aric.hagberg@gmail.com>"""
import json
import networkx as nx
from networkx.readwrite import json_graph
import http_server
import matplotlib.pyplot as plt
import random

G = nx.read_gpickle('metagraph')

# this d3 example uses the name attribute for the mouse-hover value,
# so add a name to each node
for n in G.nodes(data=True):
    n[1]['name'] = n[1]['Type']
H = nx.convert_node_labels_to_integers(G)
# write json formatted data
d = json_graph.node_link_data(H) # node-link format to serialize
# write json
json.dump(d, open('force/gr.json','w'))


G = nx.read_gpickle('metagraph_reduced')

# this d3 example uses the name attribute for the mouse-hover value,
# so add a name to each node
for n in G.nodes(data=True):
    n[1]['name'] = n[1]['Type']
H = nx.convert_node_labels_to_integers(G)
# write json formatted data
d = json_graph.node_link_data(H) # node-link format to serialize
# write json
json.dump(d, open('force/gr2.json','w'))

G = nx.grid_graph(dim=[4,4])
H = nx.convert_node_labels_to_integers(G)
# write json formatted data
d = json_graph.node_link_data(H) # node-link format to serialize
# write json
json.dump(d, open('force/gridist4.json','w'))





print('Wrote node-link JSON data to force/force.json')
# open URL in running web browser
http_server.load_url('force/ising4.html')
print('Or copy all files in force/ to webserver and load force/force.html')

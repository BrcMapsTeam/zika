import hxl
import re

def translate(page,output,data,tag):
    
    with open(page, 'r') as myfile:
        contents=myfile.read()
    for row in data.with_columns(['#meta+text+en',tag]).gen_raw(show_headers=False, show_tags=True):
        print row
        print row[0] in contents
        contents = contents.replace(row[0],row[1])
    contents = re.sub('src="(?!http)','src="../',contents)
    contents = re.sub('href="(?!http)','href="../',contents)
    print contents
    with open(output, "w") as text_file:
        text_file.write(contents)
        
url = 'https://docs.google.com/spreadsheets/d/11HSDC5LwjwrR1rqPsHHCsQKKjy-7TBaVuVIcFR3sfU8/pub?gid=0&single=true&output=csv&force=1'
data = hxl.data(url)
translate('../index.html','../es/index.html',data,'#meta+text+es')
data = hxl.data(url)
translate('../index.html','../pt/index.html',data,'#meta+text+pt')
data = hxl.data(url)
translate('../index.html','../fr/index.html',data,'#meta+text+fr')


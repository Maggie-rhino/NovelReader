from flask import Flask, request,jsonify,session
from flask_cors import CORS
import pandas as pd
import math
import json
import jieba



app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

file_path = f'./data/articles_df_clean.csv'
df =pd.read_csv(file_path)

with open('./data/category_lists.json', 'r', encoding='utf-8') as f:
    category_lists = json.load(f)


@app.route('/pagination')
def pagination():
    page = request.args.get('page', type=int)
    print(" the page number i received is ",page)
    # 你的逻辑代码

    df['totalPage'] =math.ceil(len(df)/20)
    sub_df = df[page*20:(page+1)*20]
#     title,url,abstract,date,category,tag
    data = sub_df.to_dict(orient='records')
    print("I received the request!!")
    return jsonify(data)


# get the novel content
@app.route('/novels', methods=['GET'])
def fetch_content():
    year, month,day,id = (request.args.get(key) for key in ('year', 'month','day','id'))
    id_int = int(id)
    url = f"{year}/{month}/{day}/{id}"
    current_df = df.loc[df['txt_path'] == url]
    current =current_df.to_dict(orient='records')[0]
    txt = read_text(f"./data/{url}.txt")
    current['content']=txt

    current_idx = current_df.index.values[0]
    prev_idx = max(current_idx-1,0)
    next_idx = min(current_idx+1,len(df)-1)
    print(prev_idx,current_idx,next_idx)
    prev_info = df[prev_idx:prev_idx+1].to_dict(orient='records')[0]
    next_info = df[next_idx:next_idx+1].to_dict(orient='records')[0]
    data = {"currentArticle":current,"previousArticle":prev_info,"nextArticle":next_info}
    return jsonify(data)


@app.route('/category', methods=['GET'])
def fetch_category():
    return jsonify(category_lists)


@app.route('/category/singleList', methods=['GET'])
def fetch_category_single_list():
        c_name = request.args.get('cName')
        c_list = df[df['category']==c_name][['title','txt_path']].to_dict(orient='records')
        return c_list


@app.route('/search', methods=['GET'])
def search():
    search_string = request.args.get('searchString')
    print("search_string is ",search_string)
    df['tmp'] = df.apply(lambda x : search_match(set(search_string),set(x['search_NER'])),axis=1)
    sub_df = df[df['tmp']>=1]
    sub_df =sub_df.sort_values(by='tmp', ascending=False)
    sub_df =sub_df[:10]
    print(sub_df)
    return jsonify(sub_df.to_dict(orient='records'))



def search_match(s1_set,s2_set):
    return len(s1_set&s2_set)






@app.route('/tag', methods=['GET'])
def fetch_tag():
        tag_list =df['tag'].unique().tolist()
        return tag_list


@app.route('/tag/singleTagList', methods=['GET'])
def fetch_tag_single_list():
        t_name = request.args.get('tName')
        t_list = df[df['tag']==t_name][['title','txt_path']].to_dict(orient='records')
        return t_list


def read_text(file_path):
    with open(file_path) as f:
        txt = f.readlines()
    return txt


if __name__ =="__main__":
    app.run(port=7788,debug=True)

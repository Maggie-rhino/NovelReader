
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'antd'; // Import Ant Design components
import { AppstoreOutlined, TagsOutlined } from '@ant-design/icons';

import MyContext from '../../MyContext';
import ConImage from '../../Banner/connectImage';
import './index.css'

function NovelContent() {
    // const { page, id } = useParams();
    const {year,month,day,id} =useParams();
    const theme = useContext(MyContext);
    const [data,setData] = useState({});
    const [currentArticle,setCurrentArticle] = useState({});
    const [previousArticle,setPreviousArticle] = useState({});
    const [nextArticle,setNextArticle] = useState({});


    useEffect(() => {
        fetchNovelContent(year, month, day, id)
    }, [year, month, day, id]);


    const fetchNovelContent = async (year,month,day,id) => {
        try {
            const response = await fetch(`http://localhost:7788/novels?year=${year}&month=${month}&day=${day}&id=${id}`);
            const data = await response.json();
            setData(data)
            setCurrentArticle(data.currentArticle);
            setPreviousArticle(data.previousArticle);
            setNextArticle(data.nextArticle);
        } catch (err) {
            const data ={"currentArticle":{"title":"oops! something went wrong"}}
            setCurrentArticle(data.currentArticle);
        }
    };



    return (
        <div className={theme === 'dark' ? 'dark' : 'light'}>
            <ConImage />
            <div className={`content_container ${theme === 'dark' ? 'dark' : 'light'}`}>
                <div className="novel_content">
                    <Card bordered={false} style={{ padding: '16px' }} className={`article-card ${theme === "dark" ? "dark" : "light"}`}>
                        <h3 level={3} style={{ marginBottom: '20px' }}>{currentArticle.title}</h3>
                        <pre style={{
                            whiteSpace: 'pre-wrap',
                            textAlign: 'left',
                            margin: 0,
                            fontFamily: 'Courier New, monospace',  // Custom font
                            fontSize: '15px',  // Custom font size
                            lineHeight: '1.3',  // Line height for readability
                        }}>
                            {currentArticle.content}
                        </pre>
                    </Card>
                </div>
                <hr/>
                <div >
                    <div className="post-meta">
                        <div className="source">
                            <i><AppstoreOutlined/></i>
                            <span>
                                <a  href={`/category/${currentArticle.category}`} className="link-hover">{currentArticle.category}</a>
                            </span>
                        </div>
                        <div className="tag">
                            <i><TagsOutlined /></i>
                            <span>
                                <a href={`/tag/${currentArticle.tag}`} className="link-hover">{currentArticle.tag}</a>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="prev-next">
                    <article className="prev">
                        <a href={`/content/${previousArticle.txt_path}`}>{previousArticle.title}</a>
                    </article>
                    <article className="next">
                        <a href={`/content/${nextArticle.txt_path}`}>{nextArticle.title}</a>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default NovelContent;


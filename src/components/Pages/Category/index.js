import React, { useContext,useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import MyContext from "../../MyContext";
import ConImage from "../../Banner/connectImage";
import { RightOutlined, DownOutlined } from '@ant-design/icons'; // Import Ant Design icons for the arrow


import { Row, Col, Card,Tag } from 'antd';

function Category() {
    const theme = useContext(MyContext);
    const navigate = useNavigate();

    const [expandedIndex, setExpandedIndex] = useState(null);
    const[listToRender, setListToRender] = useState([]);
    const[categoryList, setCategoryList] = useState([]);

    const toggleExpand = (index) => {
        if(expandedIndex === index){
            setExpandedIndex(null);
            setListToRender([])
        }else{
            setExpandedIndex(index);
            setListToRender(categoryList[index].lists)
        }
    }

    //  fetch data and setdata
    const fetchData = async () => {
        try {
            // get data
            const response = await fetch(`http://localhost:7788/category`,);
            const data =await response.json();
            setCategoryList(data);
        }catch (error){
            const fakeData = [{'title':"oops, something went wrong"}]
            // Set error message
            setCategoryList(fakeData);
        }
    }

    useEffect( () =>{
        fetchData();
    },[])


    return (
        <div className={theme === "dark" ? "dark" : "light"}>
            <ConImage />
            <div className={`content_container ${theme === "dark" ? "dark" : "light"}`}>
                <div >
                    <Row gutter={[0, 0]}>
                        {categoryList.map((item, index) => (
                            <Col span={24} key={index} style={{ marginBottom: '0' }}>
                                <Card bordered={false} style={{ margin: '0' }} className={`article-card  ${theme === "dark" ? "dark" : "light"}`}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h3 style={{
                                            margin: 0,
                                            fontSize: '16px',
                                            lineHeight: '1.2',
                                        }}
                                            onClick={() => toggleExpand(index)}
                                        >{item.category}
                                            <span style={{marginLeft: '8px'}}>
                                                 {expandedIndex === index ? <DownOutlined/> : <RightOutlined/>} {/* Toggle the arrow */}
                                            </span>
                                        </h3>
                                        <p style={{margin: 0, fontSize: '12px', lineHeight: '1.2', textAlign: 'right'}}>{item.count}</p>
                                    </div>
                                    {expandedIndex === index && listToRender.length > 0 && (
                                        <div style={{marginTop: '10px', paddingLeft: '20px'}}>
                                            <div>
                                                {listToRender.slice(0,10).map((item, idx) => (
                                                    <div key={idx} style={{marginBottom: '8px'}}>
                                                        <a href={`/content/${item.txt_path}`}
                                                           style={{fontSize: '14px'}}>
                                                            {item.title}
                                                        </a>
                                                    </div>
                                                ))}
                                                {listToRender.length>10 && (
                                                    <>
                                                        <div style={{fontSize: '14px', color: '#888'}}>...</div>
                                                        <div
                                                            onClick={() => navigate(`/category/${item.category}`)}
                                                            style={{
                                                                fontSize: '14px',
                                                                color: '#1890ff',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            more
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </div>
    );
}

export default Category;

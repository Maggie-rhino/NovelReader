import React, {useContext, useEffect} from "react";
import ConImage from "../../Banner/connectImage";
import MyContext from "../../MyContext";

import { Row, Col, Card } from 'antd';

import usePagination from "./usePagination";
import PaginationComponent from "./PaginationComponent";
import {Link,useNavigate} from "react-router-dom";


const Home =() =>{
    const theme =useContext(MyContext);
    const {data:articles,currentPage, totalPage, handlePageChange} =usePagination("http://localhost:7788");
    const navigate = useNavigate();


    useEffect(() => {
        if (currentPage ==1){
            navigate('/home');
        }else{
            navigate(`/home/${currentPage}`);
        }
    }, [currentPage,navigate]);


    const onPageChange = (newPage) => {
        if (newPage === 1) {
            navigate('/home');
        } else {
            navigate(`/home/${newPage}`);
        }
        handlePageChange(newPage);
    };

    return (
        <div className={theme === "dark" ? "dark" : "light"}>
            <ConImage />
            <div >
                <div >
                    <Row gutter={[8, 8]} >
                        {articles.map((article, index) => (
                            <Col span={24} key={article.id}>
                                <Card bordered={false} style={{ padding: '8px' }} className={`article-card content_container ${theme === "dark" ? "dark" : "light"}`}>
                                    <h2>
                                        <Link to={`/content/${article.txt_path}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                            {article.title}
                                        </Link>
                                    </h2>
                                    <p>
                                        <Link to={`/content/${article.txt_path}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                            {article.abstract}
                                        </Link>
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                                        <div style={{display: 'flex', gap: '16px'}}>
                                            <p>{article.date}</p>
                                            <p>{article.author}</p>
                                            <p><a href={`/category/${article.category}`}>
                                                {article.category}
                                            </a>
                                            </p>
                                            <span>
                                                <p style={{marginLeft:"10px"}}><a href={`/tag/${article.tag}`}>
                                                {article.tag}
                                            </a>
                                            </p>
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <PaginationComponent
                        totalPage={totalPage-1}
                        onChange={onPageChange}

                    />
                </div>
            </div>
        </div>
    )
};

export default Home;
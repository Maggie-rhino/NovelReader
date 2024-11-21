import React, { useContext,useState,useEffect } from 'react';
import { useNavigate,useParams } from 'react-router-dom';


import MyContext from "../../../MyContext";
import ConImage from "../../../Banner/connectImage";


import { Row, Col, Card,Pagination } from 'antd';



function SingleListPage() {
    const theme = useContext(MyContext);
    const navigate = useNavigate();
    const {cName} =useParams();

    const[listToRender, setListToRender] = useState([]);
    const[currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * 20;
    const endIndex = startIndex + 20;
    const itemsToDisplay = listToRender.slice(startIndex, endIndex);


    //  fetch data and setdata
    const fetchData = async () => {
        try {
            // get data
            const response = await fetch(`http://localhost:7788/category/singleList?cName=${cName}`);
            const data =await response.json();
            setListToRender(data);
        }catch (error){
            const fakeData = [{'title':"oops, something went wrong"}]
            // Set error message
            setListToRender(fakeData);
        }
    }

    useEffect( () =>{
        fetchData();
    },[])

    const onPageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className={theme === "dark" ? "dark" : "light"}>
            <ConImage />
            <div className={`content_container ${theme === "dark" ? "dark" : "light"}`}>
                <div className="novel_content">
                    <Row gutter={[0, 0]}>
                            <Col span={24}  style={{ marginBottom: '0' }}>
                                <Card bordered={false} style={{ margin: '0' }} className={`article-card content_container ${theme === "dark" ? "dark" : "light"}`}>
                                        <div style={{marginTop: '10px', paddingLeft: '20px'}}>
                                            <div>
                                                {itemsToDisplay.map((item, idx) => (
                                                    <div key={idx} style={{marginBottom: '8px'}}>
                                                        <a href={`/content/${item.txt_path}`}
                                                           style={{fontSize: '18px'}}>
                                                            {item.title}
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                </Card>
                            </Col>
                    </Row>
                    <Pagination
                        current={currentPage}
                        total={listToRender.length}
                        pageSize ={20}
                        onChange={onPageChange}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        </div>
    );
}

export default SingleListPage;

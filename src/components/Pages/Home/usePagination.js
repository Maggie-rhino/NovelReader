import {useState,useEffect} from "react";
import {useNavigate} from "react-router-dom";

const usePagination = (apiEndpoint) =>{

    const [data,setData] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const  navigate = useNavigate();


    useEffect(()=>{
        fetchData(currentPage)
    },[currentPage]);

    const fetchData = async (page) => {
        try {
            // get data
            const response = await fetch(`${apiEndpoint}/pagination?page=${page}`,);
            const data =await response.json();
            setData(data);
            setTotalPage(data[0].totalPage);
        }catch (error){
            const fakeData = [
                {
                    "abstract": "hello",
                    "author": "maggie",
                    "category": "love",
                    "date": "2022-10-10",
                    "id": "12345678",
                    "title": "Hello, world!",
                    "totalPage": 23
                },
                {
                    "abstract": "2 hello",
                    "author": "maggie",
                    "category": "love",
                    "date": "2022-10-10",
                    "id": "12345678",
                    "title": "Hello, world!",
                    "totalPage": 23
                }
            ];
            // Set fake data
            setData(fakeData);
            setTotalPage(fakeData[0].totalPage);
            // setTotalItems(1);  // Assuming only one page of fake data
        }
    }

    const  handlePageChange = (page) => {
        setCurrentPage(page);
        navigate(`/home/${page}`); // Update the URL to reflect the current page
    }


    return {
        data,
        currentPage,
        totalPage,
        handlePageChange
    };
};


export  default  usePagination;
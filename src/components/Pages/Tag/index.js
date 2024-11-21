import React, { useContext, useEffect, useState } from 'react';
import { Typography } from 'antd';
import MyContext from "../../MyContext";
import ConImage from '../../Banner/connectImage';

const Tag = () => {
    const theme = useContext(MyContext);
    const styles = [
        { fontSize: '15px', color: '#b0a4e3', fontWeight: 'bold' },
        { fontSize: '20px', color: '#7a7c9e', fontWeight: 'bold' },
        { fontSize: '25px', color: '#4c5a87', fontWeight: 'bold' }
    ];

    const getRandomStyle = () => styles[Math.floor(Math.random() * styles.length)];

    const [tags, setTags] = useState([]);

    const fetchTagList = async () => {
        try {
            const response = await fetch(`http://localhost:7788/tag`);
            const data = await response.json();
            setTags(data);
        } catch (err) {
            const data = ["oops! something went wrong"];
            setTags(data);
        }
    };

    useEffect(() => {
        fetchTagList();
    }, []);

    return (
        <div className={theme === 'dark' ? 'dark' : 'light'}>
            <ConImage />
            <div
                className={`content_container ${theme === 'dark' ? 'dark' : 'light'}`}
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '30px', // Space between items
                    padding:"30px",
                    marginBottom: '20px'
                }}
            >
                {tags.map((item, index) => {
                    const style = getRandomStyle();
                    return (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '8px 16px', // Adds 16px padding on left and right for space
                                margin: '0 8px', // Adds additional margin between items
                                textAlign: 'center',
                                whiteSpace: 'normal', // Allows text to wrap
                            }}
                        >
                            <Typography.Text
                                style={{
                                    fontSize: style.fontSize,
                                    color: style.color,
                                    fontWeight: style.fontWeight,
                                    lineHeight: '1.2',
                                }}
                            >
                                <a
                                    href={`/tag/${item.replace("#","")}`}
                                    style={{
                                        color: 'inherit', // Inherit color from parent
                                        textDecoration: 'none', // Remove underline
                                        transition: 'color 0.2s ease-in-out', // Smooth hover effect
                                    }}
                                    onMouseOver={(e) => (e.currentTarget.style.color = '#4791ff')} // Hover color
                                    onMouseOut={(e) => (e.currentTarget.style.color = style.color)} // Reset color
                                >{item}</a>
                            </Typography.Text>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Tag;

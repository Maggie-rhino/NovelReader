import React, { useState } from 'react';
import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';
import { AppstoreOutlined, HomeOutlined, TagsOutlined, MailOutlined, MenuOutlined } from '@ant-design/icons';
import { Menu, Input, Modal, Button, List, Switch, Drawer } from 'antd';
import MyContext from '../MyContext';
import Home from '../Pages/Home/index';
import Category from '../Pages/Category';
import AboutMe from '../Pages/AboutMe/index';
import Tag from '../Pages/Tag';
import NovelContent from "../Pages/Novelcontent/index";
import SingleListPage from "../Pages/Category/SingleListPage";
import SingleTagPage from "../Pages/Tag/SingleTag";

import "./index.css";

function MyHeader() {
    const [current, setCurrent] = useState('');
    const [theme, setTheme] = useState('dark');
    const { Search } = Input;

    const [openModal, setOpenModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(true);
    const [searchString, setSearchString] = useState('');
    const [searchLists, setSearchLists] = useState([]);

    // Drawer state (for the hamburger menu)
    const [drawerVisible, setDrawerVisible] = useState(false);

    // Highlight the selected key
    const onClick = (e) => {
        setCurrent(e.key);
    };

    const changeTheme = (value) => {
        setTheme(value ? 'light' : 'dark');
    };

    // Fetch search list from backend
    const fetchSearchList = async (query) => {
        try {
            setModalLoading(true);
            const response = await fetch(`http://localhost:7788/search?searchString=${query}`);
            const data = await response.json();
            setSearchLists(data);
        } catch (error) {
            setSearchLists([]);
        } finally {
            setModalLoading(false);
        }
    };

    // On Search trigger
    const onSearch = (value) => {
        setSearchString(value); // Update search string
        setOpenModal(true); // Open modal to show results
        fetchSearchList(value); // Fetch results immediately
    };

    // Menu items excluding the first item for the drawer (hamburger menu)
    const items = [
        {
            label: (<NavLink to='/home'><h3 style={{ marginLeft: "5%" }}>盐神搬运工</h3></NavLink>)
        },
        {
            label: <NavLink to='/home'>主页</NavLink>,
            key: '/home',
            icon: <HomeOutlined />
        },
        {
            label: <NavLink to='/category'>分类</NavLink>,
            key: '/category',
            icon: <AppstoreOutlined />
        },
        {
            label: <NavLink to='/tag'>标签</NavLink>,
            key: '/tag',
            icon: <TagsOutlined />
        },
        {
            label: <NavLink to='/aboutme'>联系我</NavLink>,
            key: '/aboutme',
            icon: <MailOutlined />
        },
        {
            label: (
                <Switch
                    checkedChildren="关灯"
                    unCheckedChildren="开灯"
                    checked={theme === 'light'}
                    onChange={changeTheme}
                />
            )
        },
        {
            label: (
                <Search
                    placeholder="请输入搜索内容"
                    allowClear
                    enterButton="Search"
                    size="mid"
                    onSearch={onSearch}
                    style={{ width: '300px' }}
                />
            )
        },
    ];

    // Menu items for the drawer (excluding the first item)
    const drawerItems = items.slice(1); // Exclude the first item

    // Drawer toggle function
    const toggleDrawer = () => {
        setDrawerVisible(!drawerVisible);
    };

    // Check if the screen is small (e.g., max-width 768px)
    const isMobile = window.innerWidth <= 768;

    return (
        <MyContext.Provider value={theme}>
            <Router>
                <div>
                    {/* Hamburger Button for Small Screens (Displayed on the Right) */}
                    {isMobile && (
                        <Button
                            type="primary"
                            icon={<MenuOutlined />}
                            onClick={toggleDrawer}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',  // Positioning the hamburger button on the right
                                zIndex: 1000
                            }}
                        />
                    )}

                    {/* Drawer for Small Screens */}
                    <Drawer
                        title={<span style={{ color: theme === 'light' ? '#000' : '#fff' }}>{items[0].label}</span>} // Title color based on theme
                        placement="left"
                        closable={false}
                        onClose={toggleDrawer}
                        visible={drawerVisible}
                        width={250}
                        style={{
                            backgroundColor: theme === 'light' ? '#fff' : '#001529', // Light theme: white, Dark theme: dark blue
                            color: theme === 'light' ? '#000' : '#fff', // Text color changes with theme
                        }}
                    >
                        <Menu
                            theme={theme}
                            onClick={onClick}
                            selectedKeys={[current]}
                            mode="vertical" // Vertical mode for small screens
                            items={drawerItems} // Only display items from index 1 onward
                            style={{ fontSize: '1rem' }}
                        />
                    </Drawer>

                    {/* Main Menu for Larger Screens */}
                    {!isMobile && (
                        <Menu
                            className="sticky-menu"
                            theme={theme}
                            onClick={onClick}
                            selectedKeys={[current]}
                            mode="horizontal"
                            items={items}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1.05rem' }}
                        >
                            {items.map(item => (
                                <Menu.Item key={item.key} icon={item.icon}>
                                    {item.label}
                                </Menu.Item>
                            ))}
                        </Menu>
                    )}

                    <Routes>
                        <Route path='/home' exact element={<Home />} />
                        <Route path='/home/:page' exact element={<Home />} />
                        <Route path='/tag' element={<Tag />} />
                        <Route path='/category' element={<Category />} />
                        <Route path='/aboutme' element={<AboutMe />} />
                        <Route path="/content/:year/:month/:day/:id" element={<NovelContent />} />
                        <Route path="/category/:cName" element={<SingleListPage />} />
                        <Route path="/tag/:tName" element={<SingleTagPage />} />
                    </Routes>

                    <Modal
                        title="Search Results"
                        open={openModal}
                        onCancel={() => setOpenModal(false)}
                        footer={<Button onClick={() => setOpenModal(false)}>Close</Button>}
                    >
                        {modalLoading ? (
                            <p>Loading...</p>
                        ) : (
                            <List
                                itemLayout="horizontal"
                                dataSource={searchLists}
                                renderItem={(item, index) => (
                                    <List.Item key={index}>
                                        <List.Item.Meta
                                            title={<h3><a href={`/content/${item.txt_path}`}>{item.title}</a></h3>}
                                            description={<a href={`/content/${item.txt_path}`}>{item.abstract}</a>}
                                        />
                                    </List.Item>
                                )}
                            />
                        )}
                    </Modal>
                </div>
            </Router>
        </MyContext.Provider>
    );
}

export default MyHeader;

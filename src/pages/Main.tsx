import React, { useState } from 'react';
import styles from './SignUp.module.css';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import InfoSection from '../components/InfoSection';
import FilterTabs from '../components/FilterTabs';
import CardGrid from '../components/CardGrid';
import FooterInfoSection from '../components/FooterInfoSection';

const girls = [
  {
    name: 'Lyly Gái Gọi',
    area: 'Dương Đông',
    price: '700.000 VND',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1673897224148-32491ab112b6?fm=jpg&q=60&w=3000',
    zalo: '0965209115',
    phone: '0965209115',
    description: 'Nhiệt tình - Vui vẻ',
    info: {
      'Người đánh': 'Ngọc Miu',
      'ZALO': '0965209115',
      'Giá 1 lần': '700.000 VND',
      'Giá phòng': '150.000 VND',
      'Năm sinh': '2002',
      'Khu vực': 'Dương Đông',
      'Chiều cao': '160cm',
      'Cân nặng': '46kg',
      'Số đo': '88,60,85',
    },
  },
  {
    name: 'Miu Miu',
    area: 'Dương Tơ',
    price: '800.000 VND',
    rating: 4,
    img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?fm=jpg&q=60&w=3000',
    zalo: '0965209222',
    phone: '0965209222',
    description: 'Ngọt ngào - Dịu dàng',
    info: {
      'Người đánh': 'Anh Tuấn',
      'ZALO': '0965209222',
      'Giá 1 lần': '800.000 VND',
      'Giá phòng': '180.000 VND',
      'Năm sinh': '2001',
      'Khu vực': 'Dương Tơ',
      'Chiều cao': '158cm',
      'Cân nặng': '48kg',
      'Số đo': '86,62,88',
    },
  },
  {
    name: 'Bảo Ngọc',
    area: 'Hàm Ninh',
    price: '900.000 VND',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=jpg&q=60&w=3000',
    zalo: '0965209333',
    phone: '0965209333',
    description: 'Chuyên nghiệp - Lịch sự',
    info: {
      'Người đánh': 'Minh Quân',
      'ZALO': '0965209333',
      'Giá 1 lần': '900.000 VND',
      'Giá phòng': '200.000 VND',
      'Năm sinh': '2000',
      'Khu vực': 'Hàm Ninh',
      'Chiều cao': '162cm',
      'Cân nặng': '50kg',
      'Số đo': '90,65,90',
    },
  },
  {
    name: 'Linh Lan',
    area: 'Cửa Dương',
    price: '750.000 VND',
    rating: 3,
    img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?fm=jpg&q=60&w=3000',
    zalo: '0965209444',
    phone: '0965209444',
    description: 'Dễ thương - Năng động',
    info: {
      'Người đánh': 'Hải Đăng',
      'ZALO': '0965209444',
      'Giá 1 lần': '750.000 VND',
      'Giá phòng': '170.000 VND',
      'Năm sinh': '2003',
      'Khu vực': 'Cửa Dương',
      'Chiều cao': '159cm',
      'Cân nặng': '47kg',
      'Số đo': '87,61,86',
    },
  },
  {
    name: 'Mai Anh',
    area: 'Cửa Cạn',
    price: '850.000 VND',
    rating: 4,
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?fm=jpg&q=60&w=3000',
    zalo: '0965209555',
    phone: '0965209555',
    description: 'Hiền lành - Đáng yêu',
    info: {
      'Người đánh': 'Bảo Long',
      'ZALO': '0965209555',
      'Giá 1 lần': '850.000 VND',
      'Giá phòng': '160.000 VND',
      'Năm sinh': '2004',
      'Khu vực': 'Cửa Cạn',
      'Chiều cao': '157cm',
      'Cân nặng': '45kg',
      'Số đo': '85,60,84',
    },
  },
  {
    name: 'Ngọc Trinh',
    area: 'Bãi Thơm',
    price: '950.000 VND',
    rating: 5,
    img: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?fm=jpg&q=60&w=3000',
    zalo: '0965209666',
    phone: '0965209666',
    description: 'Sang chảnh - Đẳng cấp',
    info: {
      'Người đánh': 'Hoàng Nam',
      'ZALO': '0965209666',
      'Giá 1 lần': '950.000 VND',
      'Giá phòng': '210.000 VND',
      'Năm sinh': '1999',
      'Khu vực': 'Bãi Thơm',
      'Chiều cao': '163cm',
      'Cân nặng': '49kg',
      'Số đo': '91,66,92',
    },
  },
  {
    name: 'Hà My',
    area: 'An Thới',
    price: '700.000 VND',
    rating: 4,
    img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?fm=jpg&q=60&w=3000',
    zalo: '0965209777',
    phone: '0965209777',
    description: 'Vui vẻ - Hòa đồng',
    info: {
      'Người đánh': 'Quốc Bảo',
      'ZALO': '0965209777',
      'Giá 1 lần': '700.000 VND',
      'Giá phòng': '150.000 VND',
      'Năm sinh': '2002',
      'Khu vực': 'An Thới',
      'Chiều cao': '160cm',
      'Cân nặng': '46kg',
      'Số đo': '88,60,85',
    },
  },
];

const filters = [
  'Full Phú Quốc',
  'Dương Đông',
  'Dương Tơ',
  'Hàm Ninh',
  'Cửa Dương',
  'Cửa Cạn',
  'Bãi Thơm',
  'An Thới',
];

const Main: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState(filters[0]);

  const filteredGirls = activeFilter === 'Full Phú Quốc'
    ? girls
    : girls.filter(girl => girl.area === activeFilter);

  return (
    <div className={styles.wrapper} style={{ 
      minHeight: '100vh', 
      background: '#232733', 
      paddingBottom: 'var(--space-8)',
      overflowX: 'hidden'
    }}>
      <Header />
      <InfoSection />
      <FilterTabs filters={filters} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <CardGrid girls={filteredGirls} />
      <FooterInfoSection />
    </div>
  );
};

export default Main; 
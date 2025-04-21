import React from 'react'

import { useEffect, useState } from "react";
import { apiGetCategory } from '@/apis';
import EditCategoryForm from '@/components/admin/EditCategoryForm';
import BackButton from '@/components/admin/BackButton';
function EditCategory() {
  const [category, setCategory] = useState(null)
  const fetchCategory = async (cid) => {
    const res = await apiGetCategory(cid);
    setCategory(res.data)
  }
  const path = window.location.pathname;
  const cid = path.split('/').pop();
  useEffect(() => {
    const checkAuth = async () => {
      fetchCategory(cid);
    };
    checkAuth();
  }, [cid,]);
  if (!category) {
    return <div>Loading...</div>;
  }
  return (
    <div className='w-full'>
      <div>
        <BackButton turnBackPage="/admin/category" header="Quay lại" />
      </div>
      <EditCategoryForm initialData={category} />
    </div>
  )
}

export default EditCategory
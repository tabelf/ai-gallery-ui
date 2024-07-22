import {useEffect, useState} from "react";

function usePage(initLimit: number, initFunc: () => void) {
    const [page, setPage] = useState({
        offset: 1,
        limit: initLimit,
    });

    useEffect(() => {
        initFunc();
    }, [page]);

    function handlePage(offset: number) {
        setPage({...page, offset: offset});
    }

    return {page, setPage, handlePage};
}

export default usePage;

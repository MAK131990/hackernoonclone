export async function getFrontPageStories(pageNum){
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
    const response = await fetch("http://hn.algolia.com/api/v1/search?tags=front_page&page="+pageNum, requestOptions)
    // const response = await fetch("http://hn.algolia.com/api/v1/search?query=foo&page="+pageNum, requestOptions)

    return await response.json();
}
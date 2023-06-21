
/**
 * Description: helperfunction to be used within at least findTrips
 */

const paginate = (pageSize = 50, pageNumber = 1) => {
  // Calculate offset
  const offset = (pageNumber - 1) * pageSize;

  // Return pagination configuration
  return {
    limit: parseInt(pageSize),
    offset: offset,
  };
};

const getPaginationMetadata = async (model, where, pageSize, pageNumber) => {
  // Count total number of records that match the query
  const totalRecords = await model.count({ where });

  // Calculate total pages
  const totalPages = Math.ceil(totalRecords / pageSize);

  return {
    totalRecords,
    totalPages,
    currentPage: pageNumber,
    pageSize
  };
};

module.exports = { paginate, getPaginationMetadata };

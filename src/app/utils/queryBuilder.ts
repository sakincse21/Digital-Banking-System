import { Query } from "mongoose";
export const excludeField = ["searchTerm", "sort", "fields", "page", "limit"];

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public baseQuery: Query<T[], T>; // Add this for counting
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.baseQuery = modelQuery.clone(); // Clone for counting
    this.query = query;
  }

  filter(): this {
    const filter = { ...this.query };

    for (const field of excludeField) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filter[field];
    }

    this.modelQuery = this.modelQuery.find(filter);
    this.baseQuery = this.baseQuery.find(filter); // Apply same filter to base query

    return this;
  }

  search(searchableField: string[]): this {
    const searchTerm = this.query.searchTerm;
    if (searchTerm) {
      const searchQuery = {
        $or: searchableField.map((field) => ({
          [field]: { $regex: searchTerm, $options: "i" },
        })),
      };
      this.modelQuery = this.modelQuery.find(searchQuery);
      this.baseQuery = this.baseQuery.find(searchQuery); // Apply same search to base query
    }
    return this;
  }

  sort(): this {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  fields(): this {
    const fields = this.query.fields?.split(",").join(" ") || "";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  build() {
    return this.modelQuery;
  }

  async getMeta() {
    // Use baseQuery clone for counting instead of the executed modelQuery
    const totalDocuments = await this.baseQuery.clone().countDocuments();

    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(totalDocuments / limit);
    return { page, limit, total: totalDocuments, totalPage };
  }
}

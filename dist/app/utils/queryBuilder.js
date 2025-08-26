"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = exports.excludeField = void 0;
exports.excludeField = ["searchTerm", "sort", "fields", "page", "limit", "sortBy"];
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.baseQuery = modelQuery.clone(); // Clone for counting
        this.query = query;
    }
    // filter(): this {
    //   const filter = { ...this.query };
    //   for (const field of excludeField) {
    //     // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    //     delete filter[field];
    //   }
    //   if (filter.startDate || filter.endDate) {
    //   const dateFilter: Record<string, unknown> = {};
    //   if (filter.startDate) {
    //     dateFilter["$gte"] = new Date(filter.startDate);
    //   }
    //   if (filter.endDate) {
    //     dateFilter["$lte"] = new Date(filter.endDate);
    //   }
    //   (filter as any).modifiedAt = dateFilter;
    //   delete filter.startDate;
    //   delete filter.endDate;
    // }
    // console.log(filter);
    //   this.modelQuery = this.modelQuery.find(filter);
    //   this.baseQuery = this.baseQuery.find(filter); // Apply same filter to base query
    //   return this;
    // }
    filter() {
        const filter = Object.assign({}, this.query);
        for (const field of exports.excludeField) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete filter[field];
        }
        // Handle date range filtering
        if (filter.startDate || filter.endDate) {
            const dateFilter = {};
            if (filter.startDate) {
                dateFilter["$gte"] = new Date(filter.startDate);
            }
            if (filter.endDate) {
                dateFilter["$lte"] = new Date(filter.endDate);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            filter.createdAt = dateFilter;
            delete filter.startDate;
            delete filter.endDate;
        }
        this.modelQuery = this.modelQuery.find(filter);
        this.baseQuery = this.baseQuery.find(filter);
        return this;
    }
    search(searchableField) {
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
    sort() {
        const sortBy = this.query.sortBy;
        const sort = this.query.sort && sortBy ? (this.query.sort === 'asc' ? `${sortBy}` : `-${sortBy}`) : "-updatedAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    fields() {
        var _a;
        const fields = ((_a = this.query.fields) === null || _a === void 0 ? void 0 : _a.split(",").join(" ")) || "";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    build() {
        return this.modelQuery;
    }
    getMeta() {
        return __awaiter(this, void 0, void 0, function* () {
            // Use baseQuery clone for counting instead of the executed modelQuery
            const totalDocuments = yield this.baseQuery.clone().countDocuments();
            const page = Number(this.query.page) || 1;
            const limit = Number(this.query.limit) || 10;
            const totalPage = Math.ceil(totalDocuments / limit);
            return { page, limit, total: totalDocuments, totalPage };
        });
    }
}
exports.QueryBuilder = QueryBuilder;

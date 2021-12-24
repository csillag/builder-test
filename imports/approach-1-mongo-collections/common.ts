import { Mongo } from "meteor/mongo";
import { Company } from "/imports/common/data/types";

/**
 * A Meteor Collection for accessing companies
 */
export const CompanyCollection = new Mongo.Collection<Company>("companies");


from flask_restful import Resource, fields, marshal_with, reqparse
from flask_restful.inputs import int_range
from werkzeug.exceptions import NotFound

import services
from controllers.web import api
from fields.conversation_fields import message_file_fields
from fields.message_fields import agent_thought_fields
from fields.raws import FilesContainedField
from libs.helper import TimestampField, uuid_value
from services.lin.message_service import LinMessageService


class LinWebApiResource(Resource):
    method_decorators = []


class LinMessageListApi(LinWebApiResource):
    feedback_fields = {"rating": fields.String}

    retriever_resource_fields = {
        "id": fields.String,
        "message_id": fields.String,
        "position": fields.Integer,
        "dataset_id": fields.String,
        "dataset_name": fields.String,
        "document_id": fields.String,
        "document_name": fields.String,
        "data_source_type": fields.String,
        "segment_id": fields.String,
        "score": fields.Float,
        "hit_count": fields.Integer,
        "word_count": fields.Integer,
        "segment_position": fields.Integer,
        "index_node_hash": fields.String,
        "content": fields.String,
        "created_at": TimestampField,
    }

    message_fields = {
        "id": fields.String,
        "conversation_id": fields.String,
        "parent_message_id": fields.String,
        "inputs": FilesContainedField,
        "query": fields.String,
        "answer": fields.String(attribute="re_sign_file_url_answer"),
        "message_files": fields.List(fields.Nested(message_file_fields)),
        "feedback": fields.Nested(feedback_fields, attribute="user_feedback", allow_null=True),
        "retriever_resources": fields.List(fields.Nested(retriever_resource_fields)),
        "created_at": TimestampField,
        "agent_thoughts": fields.List(fields.Nested(agent_thought_fields)),
        "status": fields.String,
        "error": fields.String,
    }

    message_infinite_scroll_pagination_fields = {
        "limit": fields.Integer,
        "has_more": fields.Boolean,
        "data": fields.List(fields.Nested(message_fields)),
    }

    @marshal_with(message_infinite_scroll_pagination_fields)
    def get(self,):
        parser = reqparse.RequestParser()
        parser.add_argument("conversation_id", required=True, type=uuid_value, location="args")
        parser.add_argument("first_id", type=uuid_value, location="args")
        parser.add_argument("limit", type=int_range(1, 100), required=False, default=20, location="args")
        args = parser.parse_args()

        try:
            return LinMessageService.pagination_by_first_id(
                args["conversation_id"], args["first_id"], args["limit"], "desc"
            )
        except services.errors.conversation.ConversationNotExistsError:
            raise NotFound("Conversation Not Exists.")
        except services.errors.message.FirstMessageNotExistsError:
            raise NotFound("First Message Not Exists.")


api.add_resource(LinMessageListApi, "/shared_messages")

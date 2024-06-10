import {
  CriteriaWithPagination,
  EuiBasicTable,
  EuiBasicTableColumn,
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHealth,
  EuiImage,
  EuiLink,
  EuiSpacer,
  EuiTableSelectionType,
  Pagination,
  EuiIcon,
  EuiFormRow,
  EuiComboBox,
  euiPaletteColorBlindBehindText,
} from "@elastic/eui";
import { Divider, Title, Menu, NumberInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { NotificationExtension } from "../../../_base/extension/NotificationExtension";
import {
  isNullOrEmpty,
  isNullOrUndefined,
  isNullOrUndefinedArry,
} from "../../../_base/extension/StringExtension";
import { paginationBase } from "../../../_base/model/_base/BaseTable";
import { ParamSearchBase } from "../../../_base/model/_base/ParamSearchBase";
import AppAction from "../../../common/AppAction";
import AppSearch from "../../../common/AppSearch";
import CreateView from "./CreateView";
import DeleteView from "./DeleteView";
import { getArticleCategory } from "../../../api/ApiArticle";
import Repository from "../../../_base/helper/HttpHelper";
import { API_ROUTE } from "../../../const/apiRoute";
import { MessageResponse } from "../../../model/MessageResponse";
import EditView from "./EditView";
import { useDisclosure } from "@mantine/hooks";
import style from "./articlelist.module.css";
import UpdateOrderNumberView from "./updateorderNumberView";
const visColorsBehindText = euiPaletteColorBlindBehindText();

const ArticleList = () => {
  const optionSearch = {
    isActive: [
      {
        value: "2",
        label: "Bản nháp",
        "data-test-subj": "titanOption",
        color: visColorsBehindText[0],
      },
      {
        value: "1",
        label: "Đã duyệt",
        "data-test-subj": "titanOption",
        color: visColorsBehindText[1],
      },
      {
        value: "0",
        label: "Chờ duyệt",
        color: visColorsBehindText[2],
      },
    ],
  };
  const columns: Array<EuiBasicTableColumn<any>> = [
    {
      field: "id",
      name: "Id",
      sortable: true,
      truncateText: true,
      width: "3%",
    },
    {
      field: "thumnail",
      name: "Ảnh",
      sortable: true,
      truncateText: true,
      width: "10%",
      render: (thumnail: any) => {
        return <EuiImage size="" src={thumnail} alt="alt" />;
      },
    },
    {
      field: "title",
      name: "Nội dung",
      sortable: true,
      truncateText: true,
      render: (title: string, online: any) => {
        return (
          <div className={style.contentbox}>
            <EuiLink
              className={style.title}
              onClick={(e: any) => {
                const item = datas.find((x) => x.title === title);
                if (item !== undefined && item.id > 0) handleEditData(item?.id);
              }}
            >
              {title}
            </EuiLink>
            <br />
            <EuiLink target="_blank" href={online.url}>
              Xem trang bài viết
            </EuiLink>
            <p className={style.summary}>{online.summary}</p>
          </div>
        );
      },
    },
    {
      field: "visit",
      name: "Thống kê",
      sortable: true,
      truncateText: true,
      width: "10%",
      render: (visit: number, online: any) => {
        return (
          <div>
            <p>Lượt xem: {visit !== null ? visit : 0}</p>
            <p>
              Lượt thích: {online.likeCount !== null ? online.likeCount : 0}
            </p>
            <p>
              Lượt bình luận:{" "}
              {online.commentCount !== null ? online.commentCount : 0}
            </p>
            <p>
              Lượt đánh giá:{" "}
              {online.reviewCount !== null ? online.reviewCount : 0}
            </p>
          </div>
        );
      },
    },
    {
      field: "createdBy",
      name: "Quản trị",
      sortable: true,
      truncateText: true,
      width: "15%",
      render: (createdBy: string, online: any) => {
        return (
          <div>
            <p>Cập nhật bởi: {createdBy}</p>
            <p>(Thời gian: {formatDateString(online.creationDate)})</p>
          </div>
        );
      },
    },
    {
      field: "ordering",
      name: "STT",
      sortable: true,
      truncateText: true,
      width: "5%",
      render: (ordering: number, online: any) => (
        <EuiLink
          target="_blank"
          onClick={() => {
            modals.openConfirmModal({
              title: (
                <>
                  <div color="white">
                    <Title order={5}>Cập nhật STT !</Title>
                  </div>
                </>
              ),
              children: (
                <UpdateOrderNumberView
                  onSearch={() =>
                    fetchDataArticleCategory(
                      pagination.pageIndex,
                      pagination.pageSize,
                      paramSearch?.keyWord,
                      paramSearch?.inActive
                    )
                  }
                  id={online.id}
                  orderNumber={ordering ?? 0}
                  data={datas}
                />
              ),
              confirmProps: { display: "none" },
              cancelProps: { display: "none" },
            });
          }}
        >
          {ordering || 0}
        </EuiLink>
      ),
    },
    {
      field: "status",
      name: "Trạng thái",
      sortable: true,
      truncateText: true,
      width: "10%",
      render: (status: any, online: any) => (
        <EuiLink
          onClick={async (e: any) => {
            open();
            await featuredActive(online.id, "status");
          }}
        >
          <EuiHealth color={getStatusColor(status)}>
            {status === 1
              ? "Hoạt động"
              : status === 2
              ? "Bản nháp"
              : "Chờ duyệt"}
          </EuiHealth>
        </EuiLink>
      ),
    },
    {
      field: "isStricking",
      name: "Nổi bật",
      sortable: true,
      truncateText: true,
      width: "10%",
      render: (priorityStatus: any, online: any) => (
        <EuiLink
          onClick={async (e: any) => {
            open();
            await featuredActive(online.id, "priority");
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <EuiIcon type="starFilled" color={getStatusColor(priorityStatus)} />
            <span style={{ fontSize: "14px", paddingLeft: "5px" }}>
              {priorityStatus === "Y" ? "Hạ nổi bật" : "Cho nổi bật"}
            </span>
          </div>
        </EuiLink>
      ),
    },
    {
      name: "Actions",
      width: "5%",
      render: (online: any) => {
        return (
          <>
            <EuiFlexGroup
              responsive={true}
              wrap={false}
              gutterSize="s"
              alignItems="center"
            >
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  iconType="documentEdit"
                  aria-label="Dashboard"
                  color="success"
                  onClick={(e: any) => {
                    if (isNullOrUndefined(online))
                      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
                    else {
                      editItem(online.id);
                    }
                  }}
                />
              </EuiFlexItem>
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  iconType="trash"
                  color="danger"
                  onClick={(e: any) => {
                    if (isNullOrUndefined(online))
                      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
                    else {
                      deleteItem([online.id]);
                    }
                  }}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </>
        );
      },
    },
  ];

  const getStatusColor = (status: any) => {
    switch (status) {
      case 0:
        return "red";
      case 1:
        return "green";
      case 2:
        return "subdued";
      case "Y":
        return "#f9fd04";
      case "N":
        return "gray";
      default:
        return "subdued";
    }
  };

  const moment = require("moment");

  function formatDateString(inputString: any) {
    const date = moment(inputString);

    if (moment().isSame(date, "day")) {
      return "Hôm nay, " + date.format("h:mm a");
    } else {
      return date.format("DD-MM-YYYY, h:mm a");
    }
  }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [selectedFeature, setSelectedFeature] = useState<any[]>([]);
  const [featureSearch, setFeatureSearch] = useState<any[]>([]);
  const [pagination, setPagination] = useState<Pagination>(paginationBase);
  const [selectedOptions, setSelected] = useState();
  const [paramSearch, setParamSearch] = useState<ParamSearchBase>();
  const [isSelectedItem, setSelectedItems] = useState<any[]>([]);
  const [selectedActive, setSelectedActive] = useState<any[]>([]);
  const [datas, setDatas] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [dataArticleCategory, setDataArticleCategory] = useState<any[]>([]);
  const [visible, { toggle, close, open }] = useDisclosure(false);
  const handleEditData = async (id: number) => {
    if (id) {
      editItem(id);
    } else {
      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
    }
  };

  const onTableChange = async ({
    page: { index, size },
  }: CriteriaWithPagination<any>) => {
    setPagination({
      ...pagination,
      pageIndex: index,
      pageSize: size,
      totalItemCount: 1000,
    });
  };
  const onChangeActive = (selectedOptions: any) => {
    setSelectedActive(selectedOptions);
    if (!isNullOrUndefinedArry(selectedOptions)) {
      const value = selectedOptions[0].value;
      if (!isNullOrUndefined(value))
        setParamSearch({ ...paramSearch, inActive: value });
    } else setParamSearch({ ...paramSearch, inActive: undefined });
  };
  const onChange = (selectedOptions: any) => {
    setSelected(selectedOptions);
    if (!isNullOrUndefinedArry(selectedOptions)) {
      const value = selectedOptions[0].value;
      if (!isNullOrUndefined(value))
        setParamSearch({ ...paramSearch, inActive: value });
    } else setParamSearch({ ...paramSearch, inActive: undefined });
  };

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event?.target?.value;
    if (!isNullOrUndefined(key))
      setParamSearch({ ...paramSearch, keyWord: key });
  };
  const onChangeFeature = (selectedOption: any[]) => {
    setSelectedFeature(selectedOption);
    setFeatureSearch(selectedOption);
  };
  const onSelectionChange = (selectedItems: any[]) => {
    setSelectedItems(selectedItems);
  };
  const selection: EuiTableSelectionType<any> = {
    selectable: (user: any) => true,
    selectableMessage: (selectable: boolean) =>
      !selectable ? "User is currently offline" : "",
    onSelectionChange,
  };
  const loadArticleCategory = async () => {
    setDataArticleCategory([]);
    const data = await getArticleCategory("Skip=0&Take=1000");
    const transformedData = data?.data.map((item: any, index: number) => ({
      value: item.id.toString(),
      label: item.name,
      color: visColorsBehindText[index % visColorsBehindText.length],
    }));
    setDataArticleCategory(transformedData);
  };
  const openModal = () =>
    modals.openConfirmModal({
      title: (
        <>
          <div color="white">
            <Title order={5}>Thêm mới bài viết</Title>
          </div>
        </>
      ),
      children: (
        <CreateView
          datas={datas}
          onSearch={() =>
            fetchDataArticleCategory(
              pagination.pageIndex,
              pagination.pageSize,
              paramSearch?.keyWord,
              paramSearch?.inActive
            )
          }
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });

  const openModalEdit = () => {
    if (
      isSelectedItem &&
      (isSelectedItem.length < 1 || isSelectedItem.length > 1)
    )
      NotificationExtension.Warn(
        "Xin vui lòng chọn 1 danh mục bài viết để chỉnh sửa !"
      );
    else {
      editItem(isSelectedItem[0].id);
    }
  };

  const openModalDelete = () => {
    if (isSelectedItem && isSelectedItem.length < 1)
      NotificationExtension.Warn("Xin vui lòng chọn dữ liệu !");
    else {
      const ids = isSelectedItem;
      deleteItem(ids.map((item) => item?.id));
    }
  };

  function deleteItem(idItem: number[]) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Xóa bài viết</Title>
        </>
      ),
      children: (
        <DeleteView
          onSearch={() =>
            fetchDataArticleCategory(
              pagination.pageIndex,
              pagination.pageSize,
              paramSearch?.keyWord,
              paramSearch?.inActive
            )
          }
          idItem={idItem}
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  }

  function editItem(id: number) {
    modals.openConfirmModal({
      title: (
        <>
          <Title order={5}>Chỉnh sửa bài viết!</Title>
        </>
      ),

      children: (
        <EditView
          id={id}
          onSearch={() =>
            fetchDataArticleCategory(
              pagination.pageIndex,
              pagination.pageSize,
              paramSearch?.keyWord,
              paramSearch?.inActive
            )
          }
        />
      ),
      confirmProps: { display: "none" },
      cancelProps: { display: "none" },
    });
  }
  const elementSearch = [
    <Menu.Item closeMenuOnClick={false}>
      <EuiFormRow label="Trạng thái ">
        <EuiComboBox
          aria-label="Accessible screen reader label"
          placeholder="Chọn trạng thái"
          options={optionSearch.isActive}
          selectedOptions={selectedActive}
          onChange={onChangeActive}
          fullWidth={true}
          isDisabled={loading}
          isCaseSensitive
        />
      </EuiFormRow>
    </Menu.Item>,
    <Menu.Item closeMenuOnClick={false}>
      <EuiFormRow label="Loại bài viết: ">
        <EuiComboBox
          aria-label="Accessible screen reader label"
          placeholder="Chọn loại bài viết"
          options={dataArticleCategory}
          selectedOptions={selectedFeature}
          onChange={onChangeFeature}
          fullWidth={true}
          isDisabled={loading}
          isCaseSensitive
        />
      </EuiFormRow>
    </Menu.Item>,
  ];
  const fetchDataArticleCategory = async (
    index: number,
    size?: number,
    keyWord?: string,
    inActive?: boolean
  ) => {
    setLoading(true);
    setDatas([]);
    setError(undefined);
    const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
    try {
      let urlSearch = `${API_ROUTE.GET_LIST_ARTICLE_LIST}?Skip=${
        index * (size ?? 0)
      }&Take=${size}`;
      if (!isNullOrEmpty(keyWord))
        urlSearch = urlSearch + `&KeySearch=` + keyWord;
      if (!isNullOrUndefined(inActive))
        urlSearch = urlSearch + `&Status=` + inActive;
      if (!isNullOrUndefined(featureSearch)) {
        featureSearch?.forEach(
          (feature) => (urlSearch += `&ArticleCategoryId=${feature.value}`)
        );
      }
      let callapi = await repository.get<MessageResponse<any[]>>(urlSearch);
      if (isNullOrUndefined(callapi) || isNullOrUndefinedArry(callapi?.data)) {
        setTotal(0);
      } else {
        setDatas(callapi?.data ?? []);
        setPagination({
          ...pagination,
          totalItemCount: callapi?.totalCount ?? 0,
        });
        setTotal(callapi?.totalCount ?? 0);
      }
      return callapi?.data;
    } catch (error: any) {
      setError("Có lỗi xảy ra khi tải dữ liệu !");
      return null;
    } finally {
      setLoading(false);
    }
  };
  const featuredActive = async (id: number, type: string, order?: number) => {
    if (id < 1) NotificationExtension.Fails("Mã danh mục không tồn tại !");
    else {
      setLoading(true);
      const repository = new Repository(process.env.REACT_APP_Demo_APP_API_URL);
      try {
        let urlSearch =
          type === "status"
            ? API_ROUTE.MODIFY_ARTICLE_LIST_STATUS + id
            : type === "priority"
            ? API_ROUTE.MODIFY_ARTICLE_LIST_STICKING + id
            : type === "order"
            ? API_ROUTE.MODIFY_ARTICLE_LIST_ORDER + id + "&order=" + order
            : "";
        let callapi = await repository.post<MessageResponse<boolean>>(
          urlSearch
        );
        close();
        if (isNullOrUndefined(callapi)) {
          NotificationExtension.Fails(
            "Thao tác không thành công, xin vui lòng thử lại !"
          );
        } else {
          if (callapi?.success) {
            NotificationExtension.Success("Thao tác thành công !");
            await fetchDataArticleCategory(
              pagination.pageIndex,
              pagination.pageSize,
              paramSearch?.keyWord,
              paramSearch?.inActive
            );
          } else NotificationExtension.Fails("Thao tác thất bại !");
        }
        return callapi?.data;
      } catch (error: any) {
        setError("Có lỗi xảy ra khi tải dữ liệu !");
        throw new Error(error);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await fetchDataArticleCategory(
        pagination.pageIndex,
        pagination.pageSize,
        paramSearch?.keyWord,
        paramSearch?.inActive
      );
    };
    fetchData();
    loadArticleCategory();
  }, [pagination.pageIndex, pagination.pageSize]);
  return (
    <>
      <AppAction
        openModal={openModal}
        openModalDelete={openModalDelete}
        openModalEdit={openModalEdit}
      ></AppAction>
      <Divider my="sm" />
      <AppSearch
        loading={loading}
        onChange={onChange}
        onChangeText={onChangeText}
        onSearch={() =>
          fetchDataArticleCategory(
            pagination.pageIndex,
            pagination.pageSize,
            paramSearch?.keyWord,
            paramSearch?.inActive
          )
        }
        elementSearch={elementSearch}
      />
      <EuiSpacer size="l" />
      <EuiBasicTable
        tableCaption="Demo of EuiDataGrid with selection"
        items={datas ? datas : []}
        itemId="id"
        error={error}
        loading={loading}
        noItemsMessage={"Không có dữ liệu"}
        selection={selection}
        columns={columns}
        pagination={pagination}
        isSelectable={true}
        hasActions={true}
        responsive={true}
        onChange={onTableChange}
        compressed={true}
      />
    </>
  );
};

export default ArticleList;
